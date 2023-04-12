import { Card, Table, Badge, Select } from 'flowbite-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../util/Loader';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { FormatCurrency, ParseToDate } from '../../../libs/helper';
import SelectableInput from '../../util/SelectableInput';

function HistoryOfPrice({ productDetailId, type, title }) {
	const [prices, setPrices] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				const { status, data } = await axios.get(
					`/api/productdetails/${productDetailId}/prices/${type}`
				);
				status === 200 && setPrices(data);
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};
		fetchPrices();
	}, [type, productDetailId]);

	return (
		<Card className='grow'>
			<span className='text-md font-bold'>{title}</span>
			{prices === null ? (
				<Loader />
			) : (
				<Table hoverable={true}>
					<Table.Head>
						<Table.HeadCell>#</Table.HeadCell>
						<Table.HeadCell>Giá trị</Table.HeadCell>
						<Table.HeadCell>Ngày áp dụng</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{prices.map((item, index) => (
							<Table.Row
								className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
								key={index}>
								<Table.Cell>{index + 1}</Table.Cell>
								<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
									{FormatCurrency(item.value)}
								</Table.Cell>
								<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
									<Badge color={'info'} className={'w-fit'}>
										{ParseToDate(item.dateApply)}
									</Badge>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
		</Card>
	);
}

export default function ProductPricesPage() {
	const [productDetails, setProductDetails] = useState(null);
	const [selected, setSelected] = useState(0);
	const [type, setType] = useState('retail');
	const dispatch = useDispatch();
	const { id } = useParams();

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				const { data, status } = await axios.get(
					`/api/productdetails?productId=${id}&isActive=false`
				);
				if (status === 200) {
					setProductDetails([
						...data.map((item) => ({ value: item.id, label: item.unit })),
					]);
					setSelected(data[0].id)
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};
		fetchProductDetails();
	}, []);

	return productDetails === null ? (
		<Loader />
	) : (
		<Card>
			<div>Thông tin sản phẩm here</div>

			<div className='grid grid-cols-2 gap-2'>
				<SelectableInput
					id={'productDetailId'}
					defaultValue={productDetails[0]}
					isSearchable={true}
					onChange={(selected) => {
						setSelected(selected.value);
					}}
					options={productDetails}
				/>
				<Select
					defaultValue={'retail'}
					onChange={(event) => {
						setType(event.target.value);
					}}>
					<option value={'retail'}>Giá bán sỉ</option>
					<option value={'whole'}>Giá bán lẻ</option>
					<option value={'import'}>Giá nhập hàng</option>
				</Select>
			</div>
			<HistoryOfPrice
				productDetailId={selected}
				title={`Lịch sử giá ${
					type === 'retail'
						? 'bán lẻ'
						: type === 'whole'
						? 'bán sỉ'
						: 'nhập hàng'
				}`}
				type={type}
			/>
		</Card>
	);
}
