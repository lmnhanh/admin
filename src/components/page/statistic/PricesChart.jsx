import { Badge, Button, Card, Label, Modal, TextInput } from 'flowbite-react';
import { Fragment, useCallback, useState } from 'react';
import Loader from '../../util/Loader';
import axios from 'axios';
import { useEffect } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
	faArrowRight,
	faGear,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SelectableInput from '../../util/SelectableInput';
import { FormatDateToInput, ParseToDate } from '../../../libs/helper';
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function PricesChart() {
	const [chartData, setChartData] = useState(null);
	const [productDetailId, setProductDetailId] = useState(null);
	const [chartTitle, setChartTitle] = useState('');
	const [error, setError] = useState(null);
	const [showOption, setShowOption] = useState(false);
	const [fromDate, setFromDate] = useState('');
	const [fromDateSelected, setFromDateSelected] = useState('');
	const [toDate, setToDate] = useState('');
	const [toDateSelected, setToDateSelected] = useState('');
	const [products, setProducts] = useState([
		{
			value: 0,
			label: 'Chọn sản phẩm',
		},
	]);
	const [productDetails, setProductDetails] = useState([
		{
			value: 0,
			label: 'Chọn sản phẩm',
		},
	]);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
				text: chartTitle
			}
		},
	};

	const handleProductChange = useCallback(async (productId) => {
		setFromDate('');
		setToDate('');
		const { data, status } = await axios.get(
			`/api/productdetails?productId=${productId}`
		);
		if (status === 200) {
			setProductDetails(
				data.map((data) => ({ value: data.id, label: data.unit }))
			);
			data.length !== 0 && setProductDetailId(data[0].id);
			data.length !== 0 && fetchChartData(data[0].id);
		}
	});

	const fetchChartData = useCallback(
		async (id) => {
			if (!id) return;
			const { status, data } = await axios.get(
				`/api/statistic/prices/${id}?fromDate=${fromDate}&toDate=${toDate}`
			);
			if (status === 200) {
				setFromDateSelected(FormatDateToInput(data.fromDate));
				setToDateSelected(FormatDateToInput(data.toDate));
				setChartTitle(
					`Biểu đồ giá từ ${ParseToDate(data.fromDate, 1) } đến ${ParseToDate(data.toDate, 1)}`
				);
				setChartData({
					labels: data.prices.map((data) =>
						new Date(data.date).toLocaleDateString()
					),
					datasets: [
						{
							label: 'Giá nhập',
							data: data.prices.map((data) => data.importValue),
							borderColor: 'rgb(53, 162, 235)',
							backgroundColor: 'rgba(53, 162, 235, 0.5)',
						},
						{
							label: 'Giá bán sỉ',
							data: data.prices.map((data) => data.wholeValue),
							borderColor: 'rgb(255, 99, 132)',
							backgroundColor: 'rgba(255, 99, 132, 0.5)',
						},
						{
							label: 'Giá bán lẻ',
							data: data.prices.map((data) => data.retailValue),
							borderColor: 'rgb(45, 193, 80)',
							backgroundColor: 'rgba(45, 193, 80, 0.5)',
						},
					],
				});
			}
		},
		[productDetailId, fromDate, toDate]
	);

	const toogleModal = () => {
		setShowOption((prev) => !prev);
		setFromDate(fromDateSelected);
		setToDate(toDateSelected);
	};

	useEffect(()=>{
		fetchChartData(productDetailId);
	},[fetchChartData])

	useEffect(() => {
		document.title = 'Biểu đồ biến động giá';
		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts([
					{
						value: 0,
						label: 'Chọn sản phẩm',
					},
					...data.products.map((item) => ({
						value: item.id,
						label: item.name,
					})),
				]);
			}
		};
		fetchProducts();
	}, []);

	return (
		<Fragment>
			<Card className='relative'>
				<Modal
					dismissible={true}
					show={showOption}
					position={'top-center'}
					size={'md'}
					onClose={toogleModal}>
					<Modal.Header>Tùy chọn thống kê</Modal.Header>
					<Modal.Body className='grid grid-cols-2 gap-2'>
						<div>
							<Label htmlFor='product'>Bắt đầu từ:</Label>
							<TextInput
								sizing={'sm'}
								type={'date'}
								value={fromDateSelected}
								onChange={(event) => {
									let newDate = new Date(event.target.value);
									if (
										newDate <= new Date(toDate || new Date().toISOString()) &&
										Math.abs(
											newDate - new Date(toDate || new Date().toISOString())
										) /
											5184000000 <
											1
									) {
										setFromDateSelected(event.target.value);
										setError(null);
									} else {
										setError(
											'Ngày kết bắt đầu không hợp lệ hoặc khoảng cách quá 2 tháng'
										);
									}
								}}
							/>
						</div>
						<div>
							<Label htmlFor='product'>Kết thúc vào:</Label>
							<TextInput
								sizing={'sm'}
								type={'date'}
								value={toDateSelected}
								onChange={(event) => {
									let newDate = new Date(event.target.value);
									if (
										newDate.getDate() <= new Date().getDate() &&
										newDate >=
											new Date(
												fromDate || new Date().setDate(new Date().getDate() - 7)
											)
									) {
										setToDateSelected(event.target.value);
										setError(null);
									} else {
										setError('Ngày kết thúc không hợp lệ');
									}
								}}
							/>
						</div>
						{error && (
							<span className='text-sm col-span-2 text-red-600 text-center'>
								<FontAwesomeIcon icon={faWarning} className='mr-1' />
								{error}
							</span>
						)}
					</Modal.Body>
				</Modal>
				<div className='w-full md:w-9/12 self-center'>
					<div className='flex flex-wrap gap-2 mb-3'>
						<div className='grow'>
							<Label htmlFor='product'>Sản phẩm:</Label>
							<SelectableInput
								id='product'
								defaultValue={products[0]}
								isSearchable={true}
								onChange={(selected) => {
									handleProductChange(selected.value);
								}}
								options={products}
							/>
						</div>

						<div className='grow'>
							<Label htmlFor='productDetail'>Qui cách, loại:</Label>
							<select
								sizing={'sm'}
								id='productDetailId'
								defaultValue={productDetailId}
								onChange={(event) => {
									setProductDetailId(event.target.value);
									fetchChartData(event.target.value);
								}}
								className='bg-white w-full h-fit rounded-md border border-gray-300 text-sm text-gray-500 focus:ring-blue-100 focus:ring-2'>
								{productDetails.length !== 0 ? (
									productDetails.map((detail) => (
										<option key={detail.value} value={detail.value}>
											{detail.label}
										</option>
									))
								) : (
									<option key={'0'} className={'text-md space-y-6'} value={'0'}>
										Chọn sản phẩm
									</option>
								)}
							</select>
						</div>
					</div>
					<div className='absolute right-3 top-3'>
						<Badge
							className='cursor-pointer'
							title='Mặc định'
							onClick={toogleModal}>
							<FontAwesomeIcon icon={faGear} />
						</Badge>
					</div>

					{productDetailId !== null && chartData !== null ? (
						<Line options={options} data={chartData} />
					) : (
						<div className='text-center font-semibold'>Chọn sản phẩm để xem biểu đồ</div>
					)}
				</div>
			</Card>
		</Fragment>
	);
}
