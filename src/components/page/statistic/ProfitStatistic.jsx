import { Badge, Card, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../../util/Loader';
import axios from 'axios';
import { FormatCurrency, FormatDateToInput, ParseToDate } from './../../../libs/helper';
import { useNavigate } from 'react-router-dom';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRight,
	faCalendarDay,
	faCalendarDays,
	faCalendarWeek,
	faGear,
	faRotate,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';

import {
	setFilter,
	setPageSize as setOrderPageSize,
	setFromDate as setOrderFromDate,
	setToDate as setOrderToDate,
} from '../../../libs/store/orderSlice';

import {
	setFromDate as setInvoiceFromDate,
	setPageSize as setInvoicePageSize,
	setToDate as setInvoiceToDate,
} from '../../../libs/store/invoiceSlice';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function ProfitStatistic() {
	const [profit, setProfit] = useState(null);
	const [chartData, setChartData] = useState({});
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [error, setError] = useState(null);
	const [xStacked, setXStacked] = useState(true);
	const [yStacked, setYStacked] = useState(false);
	const [showOption, setShowOption] = useState(false);
	const [chartTitle, setCharTitle] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const fetchStatistic = useCallback(async () => {
		if (error == null) {
			const { status, data } = await axios.get(
				`/api/statistic/profit?fromDate=${
					fromDate && new Date(fromDate).toISOString()
				}&toDate=${toDate && new Date(toDate).toISOString()}`
			);
			if (status === 200) {
				setProfit(data.profit);
				setCharTitle(
					`Biểu đồ lợi nhuận từ ${ParseToDate(data.fromDate, 1) } đến ${ParseToDate(data.toDate, 1)}`
				);
				setChartData({
					labels: data.chartData.map((data) =>
						new Date(data.date).toLocaleDateString()
					),
					datasets: [
						{
							type: 'line',
							label: 'Lợi nhuận',
							data: data.chartData.map((data) => data.profit),
							backgroundColor: 'rgba(53, 162, 40)',
							borderColor: 'rgba(53, 162, 40, 0.5)'
						},
						{
							
							label: 'Danh thu',
							data: data.chartData.map((data) => data.revenue),
							backgroundColor: 'rgba(53, 162, 235, 0.5)',
						},
						{
							label: 'Chi phí',
							data: data.chartData.map((data) => data.cost),
							backgroundColor: 'rgba(255, 99, 132, 0.5)',
						},
					],
				});
			}
		}
	}, [fromDate, toDate, error]);

	const toogleModal = () => {
		setShowOption((prev) => !prev);
	};

	useEffect(() => {
		document.title = 'Thống kê lợi nhuận';
		fetchStatistic();
	}, [fetchStatistic]);

	const options = {
		responsive: true,
		scales: {
			x: {
				stacked: xStacked,
			},
			y: {
				stacked: yStacked,
			},
		},
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
				text: chartTitle,
			},
		},
	};

	return (
		<Card className='min-w-fit relative'>
			<Modal
				dismissible={true}
				show={showOption}
				position={'top-center'}
				size={'md'}
				onClose={toogleModal}>
				<Modal.Header>Tùy chọn thống kê</Modal.Header>
				<Modal.Body className='grid grid-cols-2 gap-2'>
					<div>
						<span className='text-sm'>Bắt đầu từ: </span>
						<TextInput
							sizing={'sm'}
							type={'date'}
							value={fromDate}
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
									setFromDate(event.target.value);
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
						<span className='text-sm'>Kết thúc vào: </span>
						<TextInput
							sizing={'sm'}
							type={'date'}
							value={toDate}
							onChange={(event) => {
								let newDate = new Date(event.target.value);
								if (
									newDate.getDate() <= new Date().getDate() &&
									newDate >=
										new Date(
											fromDate || new Date().setDate(new Date().getDate() - 7)
										)
								) {
									setToDate(event.target.value);
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
					<div className='col-span-2'>
						<Checkbox
							id='xStacked'
							checked={xStacked}
							className='mr-1'
							onChange={() => {
								setXStacked(!xStacked)
							}}
						/>
						<Label htmlFor='xStacked' className='text-sm'>
							Gộp cột danh thu và chi phí
						</Label>
					</div>
					<div className='col-span-2'>
						<Checkbox
							id='yStacked'
							className='mr-1'
							checked={yStacked}
							onChange={() => {
								setYStacked(!yStacked)
							}}
						/>
						<Label htmlFor='yStacked' className='text-sm'>
							Tách giá trị danh thu và chi phí
						</Label>
					</div>
				</Modal.Body>
			</Modal>
			{profit === null ? (
				<Loader text='Đang tải' />
			) : (
				<div className='w-full md:w-9/12 self-center'>
					<div className='absolute right-3 top-3 flex gap-2'>
						<Badge
							className='cursor-pointer'
							title='1 tháng'
							color={'success'}
							onClick={() => {
								let date = new Date();
								date.setMonth(date.getMonth() - 1);
								setFromDate(FormatDateToInput(date.toLocaleDateString()));
							}}>
							<FontAwesomeIcon icon={faCalendarDays} className='mr-1' />1 tháng
							vừa qua
						</Badge>
						<Badge
							className='cursor-pointer'
							color={'pink'}
							title='1 tuần'
							onClick={() => {
								let date = new Date();
								date.setDate(date.getDate() - 7);
								setFromDate(FormatDateToInput(date.toLocaleDateString()));
							}}>
							<FontAwesomeIcon icon={faCalendarWeek} className='mr-1' />1 tuần
							vừa qua
						</Badge>
						<Badge
							className='cursor-pointer'
							color={'info'}
							title='Hôm nay'
							onClick={() => {
								setFromDate(FormatDateToInput(new Date().toLocaleDateString()));
							}}>
							<FontAwesomeIcon icon={faCalendarDay} className='mr-1' />
							Hôm nay
						</Badge>
						<Badge
							className='cursor-pointer'
							title='Mặc định'
							onClick={() => {
								setFromDate('');
								setToDate('');
							}}>
							<FontAwesomeIcon icon={faRotate} />
						</Badge>
						<Badge
							className='cursor-pointer'
							title='Mặc định'
							onClick={toogleModal}>
							<FontAwesomeIcon icon={faGear} />
						</Badge>
					</div>
					<div className='flex gap-2 items-center text-sm pt-2'>
						<span className='text-lg font-semibold'>Lợi nhuận: </span>{' '}
						<Badge
							className='mr-5'
							size={'lg'}
							color={profit <= 0 ? 'failure' : 'success'}>
							{FormatCurrency(profit)}
						</Badge>
						<Badge
							className='cursor-pointer hover:bg-blue-200'
							color={'success'}
							onClick={() => {
								let date = new Date();
								date.setDate(date.getDate() - 7);
								dispatch(setOrderFromDate(fromDate || date.toISOString()));
								dispatch(setOrderToDate(toDate));
								dispatch(setFilter('success'));
								dispatch(setOrderPageSize(25));
								navigate('/order');
							}}>
							Danh sách đơn hàng
							<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
						</Badge>
						<Badge
							className='cursor-pointer hover:bg-blue-200'
							color={'warning'}
							onClick={() => {
								let date = new Date();
								date.setDate(date.getDate() - 7);
								dispatch(setInvoiceFromDate(fromDate || date.toISOString()));
								dispatch(setInvoiceToDate(toDate));
								dispatch(setInvoicePageSize(25));
								navigate('/invoice');
							}}>
							Danh sách hóa đơn
							<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
						</Badge>
					</div>

					<Chart type='bar' options={options} data={chartData} />
				</div>
			)}
		</Card>
	);
}
