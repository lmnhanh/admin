import axios from 'axios';
import { Badge, Card, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../../libs/store/slices';
import Loader from '../../../util/Loader';
import { ParseToDate } from '../../../../libs/helper';
import { Fragment } from 'react';

export default function SellSlowlyProduct() {
	const [sellSlowlyProducts, setSellSlowlyProducts] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchHotProducts = async () => {
			try {
				const { status, data } = await axios.get(
					`/api/productDetails/statistic/sell_slowly`
				);
				if (status === 200) {
					setSellSlowlyProducts(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchHotProducts();
	}, [dispatch]);
	return (
		<Card className='min-w-min grow relative'>
			{sellSlowlyProducts === null ? (
				<Loader />
			) : (
				<Fragment>
					<span className='text-md font-bold'>Sản phẩm bán chậm</span>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
							<Table.HeadCell>Ngày nhập gần nhất</Table.HeadCell>
							<Table.HeadCell>Số lượng bán/ngày</Table.HeadCell>
							<Table.HeadCell>Tổng hao hụt</Table.HeadCell>
							<Table.HeadCell>Số lượng hiện tại</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{sellSlowlyProducts.map((item, index) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={index}>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{`${item.product.productName}: ${item.product.unit}`}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										<Badge color={'failure'} className={'w-fit'}>
											{ParseToDate(item.lastedInvoice)}
										</Badge>
									</Table.Cell>
									<Table.Cell>{Number(item.quantityPerDay).toFixed(2)} kg</Table.Cell>
									<Table.Cell>{Number(item.wastage).toFixed(2)} kg</Table.Cell>
									<Table.Cell>{Number(item.product.stock).toFixed(2)} kg</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Fragment>
			)}
		</Card>
	);
}
