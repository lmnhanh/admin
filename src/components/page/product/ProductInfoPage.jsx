import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useRef, useState } from 'react';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faHome,
	faPenToSquare,
	faPlusCircle,
	faTrashCan,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Dropdown, Table} from 'flowbite-react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ProductInfo from '../../util/ProductInfo';
import './imageGallery.css';
import ToastPromise from '../../util/ToastPromise';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductModify from './ProductModify';

export default function ProductInfoPage(props) {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [details, setDetails] = useState([]);
	const [images, setImages] = useState([]);
	const [editing, setEditing] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const quillRef = useRef({ value: '' });

	const formik = useFormik({
		initialValues: {
			name: '',
			wellknownId: '',
			description: '',
			categoryId: '',
			isActive: true,
			isRecommended: false,
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên sản phẩm không được trống!'),
			wellknownId: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: async (values) => {
			formik.values.description = quillRef.current.value.toString();
			try {
				ToastPromise(
					axios.post('/api/products/', {
						name: values.name,
						wellknownId: values.wellknownId,
						categoryId: values.categoryId,
						description: values.description,
						isActive: values.isActive,
						isRecommended: values.isRecommended,
					}),
					{
						pending: 'Đang thêm sản phẩm',
						success: (response) => {
							navigate(`/product/${response.data.id}/detail`);
							return (
								<div className=''>
									Đã thêm {response.data.name}
									<Link to={`/product/edit/${response.data.id}`}>
										<Badge size={'xs'} className='w-fit' color={'info'}>
											Xem chi tiết
										</Badge>
									</Link>
								</div>
							);
						},
						error: (error) => {
							return 'Lỗi! Không thể thêm sản phẩm!';
						},
					}
				);
			} catch (error) {
				navigate('/');
			}
		},
	});

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

		const fetchDetails = async () => {
			const { status, data } = await axios.get(
				`/api/productdetails?productId=${id}`
			);
			status === 200 && setDetails(data);
		};

		try {
			fetchProduct();
			fetchImages();
			fetchDetails();
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
			{!editing ? (
				<div className='container gap-2 grid grid-cols-1 md:grid-cols-3'>
					<div className={`${images.length === 0 && 'place-self-center'}`}>
						{images.length !== 0 ? (
							<ImageGallery
								items={images}
								lazyLoad={true}
								showNav={false}
								slideOnThumbnailOver={true}
							/>
						) : (
							<Link to={'/'} className={'items-center'}>
								<Button size={'xs'} gradientDuoTone={'greenToBlue'}>
									Thêm ảnh
								</Button>{' '}
							</Link>
						)}
					</div>
					<Card className='relative col-span-1 md:col-span-2 self-start'>
						<div className='absolute md:top-3 md:right-3 invisible md:visible'>
							<Dropdown
								label='Tùy chọn'
								placement='left-start'
								gradientDuoTone={'cyanToBlue'}
								size={'sm'}>
								<Dropdown.Item className='w-full hover:text-blue-600' onClick={()=>{setEditing(true)}}>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-blue-500'
											icon={faPenToSquare}
										/>
										Chỉnh sửa thông tin
								</Dropdown.Item>
								<Dropdown.Item className='w-full hover:text-blue-600'>
									<Link to={`/product/${product.id}`}>
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
						<ProductInfo product={product} />
						{details.length === 0 && (
							<Link to={`/product/${id}/detail`} className={'self-center'}>
								<Button size={'xs'} gradientDuoTone={'greenToBlue'}>
									Thêm chi tiết
								</Button>
							</Link>
						)}
						{details.length !== 0 && (
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Loại</Table.HeadCell>
									<Table.HeadCell>Giá nhập</Table.HeadCell>
									<Table.HeadCell>Giá sỉ</Table.HeadCell>
									<Table.HeadCell>Giá lẻ</Table.HeadCell>
									<Table.HeadCell>Trạng thái</Table.HeadCell>
								</Table.Head>
								<Table.Body className='divide-y'>
									{details.map((item, index) => (
										<Table.Row
											className='bg-white justify-center mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
											key={index}>
											<Table.Cell>{item.unit}</Table.Cell>
											<Table.Cell>{item.importPrice}</Table.Cell>
											<Table.Cell>{item.retailPrice}</Table.Cell>
											<Table.Cell>{item.wholePrice}</Table.Cell>
											<Table.Cell>
												{item.isActive ? (
													<Badge className='w-fit' color={'success'}>
														<FontAwesomeIcon icon={faCheck} className='mr-1' />
														Đang kinh doanh
													</Badge>
												) : (
													<Badge color={'dark'}>
														<FontAwesomeIcon icon={faXmark} className='mr-1' />
														Ngừng kinh doanh
													</Badge>
												)}
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						)}
					</Card>
				</div>
			) : (
				<div className={'container'}>
					<ProductModify product={product}/>
				</div>
			)}
		</Fragment>
	) : (
		<Loader />
	);
}
