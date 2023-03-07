import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useState } from 'react';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faHome,
	faPlusCircle,
	faStar,
	faTrashCan,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Card, Dropdown } from 'flowbite-react';
import { Link } from 'react-router-dom';
import FilterBadge from './../../util/FilterBadge';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ProductInfo from '../../util/ProductInfo';

const images = [
	{
		original: 'https://picsum.photos/id/1018/1000/600/',
		thumbnail: 'https://picsum.photos/id/1018/250/150/',
	},
	{
		original: 'https://picsum.photos/id/1015/1000/600/',
		thumbnail: 'https://picsum.photos/id/1015/250/150/',
	},
	{
		original: 'https://picsum.photos/id/1019/1000/600/',
		thumbnail: 'https://picsum.photos/id/1019/250/150/',
	},
];

export default function ProductInfoPage(props) {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [editing, setEditing] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = 'Thông tin sản phẩm';

		const fetchProduct = async () => {
			try {
				const { status, data } = await axios.get(`/api/products/${id}`);
				if (status === 200 && data) {
					setProduct(data);
				}
			} catch (error) {
				if (error.response.status === 401) {
					dispatch(setAuthorized({ authorized: false }));
				}
			}
		};

		fetchProduct();
	}, [id, dispatch]);

	return product !== null ? (
		<Fragment>
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
					{ to: '/product', text: 'Sản phẩm' },
					{ to: `/product/${id}`, text: 'Thông tin sản phẩm' },
				]}
			/>
			<div className='container grid grid-cols-1 md:grid-cols-3'>
				<div className='shrink'>
					<ImageGallery items={images} lazyLoad={true} showNav={false} />
				</div>
				<Card className='relative col-span-1 md:col-span-2'>
					{!editing && (
						<div className='absolute md:top-3 md:right-3 invisible md:visible'>
							<Dropdown
								label='Tùy chọn'
								placement='left-start'
								gradientDuoTone={'cyanToBlue'}
								size={'sm'}>
								<Dropdown.Item>
									<Link
										to={`/product/${product.id}`}
										className='w-full hover:text-blue-600'>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-red-500'
											icon={faTrashCan}
										/>
										Xóa
									</Link>
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item>
									<FontAwesomeIcon
										icon={faPlusCircle}
										className='pr-1 w-4 h-4 text-green-500'
									/>
									Thêm sản phẩm
								</Dropdown.Item>
							</Dropdown>
						</div>
					)}
					<ProductInfo product={product}/>
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
