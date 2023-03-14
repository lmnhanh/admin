import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useState } from 'react';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faHome,
	faPlusCircle,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Card, Dropdown } from 'flowbite-react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ProductInfo from '../../util/ProductInfo';
import './imageGallery.css';

export default function ProductInfoPage(props) {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [images, setImages] = useState([]);
	const [editing, setEditing] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = 'Thông tin sản phẩm';

		const fetchProduct = async () => {
			const { status, data } = await axios.get(`/api/products/${id}`);
			if (status === 200 && data) {
				setProduct(data);
			}
		};

		const fetchImages = async () => {
			const { status, data } = await axios.get(`/api/images?productId=${id}`);
			if (status === 200 && data.length !== 0) {
				setImages(
					data.map((item) => ({
						original: `https://localhost:7028/api/images/get/${item}`,
						thumbnail: `https://localhost:7028/api/images/get/${item}`,
					}))
				);
			}
		};

		try {
			fetchProduct();
			fetchImages();
		} catch (error) {
			if (error.response.status === 401) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
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
			<div className='container gap-2 grid grid-cols-1 md:grid-cols-3'>
				<div className='shrink'>
					{images.length !== 0? (
						<ImageGallery items={images} lazyLoad={true} showNav={false} slideOnThumbnailOver={true} />
					) : (
						<div>Sản phẩm chưa có hình ảnh! Thêm ngay!</div>
					)}
				</div>
				<Card className='relative col-span-1 md:col-span-2 self-start'>
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
					<ProductInfo product={product} />
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
