import axios from 'axios';
import { Badge, Card, Select, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import Loader from '../../util/Loader';
import { FormatCurrency } from '../../../libs/helper';
import { Fragment } from 'react';

export default function HotestProduct() {
	const [hotProducts, setHotProducts] = useState(null);
	const [criteria, setCriteria] = useState("invoice");
	const [time, setTime] = useState("week");
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchHotProducts = async () => {
			try {
				const { status, data } = await axios.get(
					`/api/productDetails/statistic/hot?criteria=${criteria}&time=${time}`
				);
				if (status === 200) {
					setHotProducts(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchHotProducts();
	}, [criteria, time, dispatch]);
	return (
		<Card className='min-w-min grow relative'>
			{hotProducts === null ? (
				<Loader />
			) : (
				<Fragment>
					<div className='flex gap-x-2 absolute text-sm right-4 top-3'>
						<Select
							defaultValue={'invoice'}
							sizing={'sm'}
							onChange={(event) => setCriteria(event.target.value)}
							className=' hover:text-blue-700 text-blue-500 cursor-pointer'>
							<option value={'invoice'}>Tổng đơn hàng</option>
							<option value={'value'}>Tổng giá trị</option>
						</Select>
						<Select
							defaultValue={'week'}
							sizing={'sm'}
							onChange={(event) => setTime(event.target.value)}
							className=' hover:text-blue-700 text-blue-500 cursor-pointer'>
							<option value={'week'}>7 ngày qua</option>
							<option value={'month'}>30 ngày qua</option>
						</Select>
					</div>
					<span className='text-md font-bold'>Sản phẩm bán chạy</span>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
							<Table.HeadCell>Tổng giá trị</Table.HeadCell>
							<Table.HeadCell>Tổng đơn hàng</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{hotProducts.map((item, index) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={index}>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{`${item.productName}: ${item.detailName}`}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{index === 0 && <Badge color={'failure'} className={'w-fit'}>
											{FormatCurrency(item.value)}
										</Badge>}
										{index === 1 && <Badge color={'warning'} className={'w-fit'}>
											{FormatCurrency(item.value)}
										</Badge>}
										{index === 2 && <Badge color={'purple'} className={'w-fit'}>
											{FormatCurrency(item.value)}
										</Badge>}
									</Table.Cell>
									<Table.Cell>{item.total} đơn</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Fragment>
			)}
		</Card>
	);
}
