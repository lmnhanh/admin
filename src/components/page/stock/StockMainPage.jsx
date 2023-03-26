import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Label } from 'flowbite-react';
import { Fragment, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
	faBars,
	faChartLine,
	faHome,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import Loader from '../../util/Loader';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';

export default function StockMainPage(props) {
	const [products, setProducts] = useState(null);

	useEffect(() => {
		document.title = 'Quản lí số lượng sản phẩm';

		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts(
					data.products.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
			}
		};

		fetchProducts();
	});

	return products !== null ? (
		<Fragment>
			<div className='flex gap-2'>
				<Link to={'/invoice'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách đơn nhập hàng
					</Button>
				</Link>
				<Link to={'/invoice/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Link to={'/invoice/new'}>
					<Button
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}
						className='w-fit h-8 rounded-lg text-center min-w-max'>
						<FontAwesomeIcon icon={faPlus} className='pr-2 w-4 h-4' />
						Thêm đơn nhập hàng
					</Button>
				</Link>
			</div>
			<BreadcrumbPath
				items={[
					{
						to: '/',
						text: (
							<>
								<FontAwesomeIcon icon={faHome} /> Home
							</>
						),
					},
					{ to: '/stock', text: 'Quản lí số lượng sản phẩm' },
				]}
			/>
			<div className='container'>
				<Card>
					<div>
						<Label htmlFor='products'>Sản phẩm:</Label>
						<SelectableInput
							id={'products`'}
							defaultValue={products[0]}
							isSearchable={true}
							onChange={(selected) => {
								handleProductChange(selected.value);
							}}
							options={products}
						/>
					</div>
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
