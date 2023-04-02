import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faArrowRight,
	faChartLine,
	faCheck,
	faHome,
	faPencil,
	faPenToSquare,
	faPlus,
	faPlusCircle,
	faStar,
	faTrashCan,
	faWarning,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
	Badge,
	Button,
	Card,
	Checkbox,
	Dropdown,
	Label,
	Table,
	TextInput,
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './imageGallery.css';
import ToastPromise from '../../util/ToastPromise';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FilterBadge from '../../util/FilterBadge';
import SelectableInput from '../../util/SelectableInput';
import TextEditor from '../../util/TextEditor';
import UpLoadImage from './UploadImage';
import { FormatCurrency } from '../../../libs/helper';

export default function ProductInfoPage(props) {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [details, setDetails] = useState([]);
	const [categories, setcategories] = useState([]);
	const [images, setImages] = useState([]);
	const [editing, setEditing] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const quillRef = useRef({ value: '' });

	const formik = useFormik({
		initialValues: {
			id: id,
			name: '',
			wellKnownId: '',
			description: '',
			categoryId: 0,
			isActive: true,
			isRecommended: false,
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên sản phẩm không được trống!'),
			wellKnownId: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: async (values) => {
			formik.values.description = quillRef.current.value.toString();
			if (!values.isActive) values.isRecommended = false;
			ToastPromise(axios.put(`/api/products/${id}`, values), {
				pending: 'Đang cập nhật sản phẩm',
				success: (response) => {
					setEditing(false);
					fetchProduct();
					return <div className=''>Cập nhật thành công</div>;
				},
				error: (error) => {
					if (error.response?.status === 400) {
						let finalObj = {};
						error.response?.data.forEach((item) =>
							Object.assign(finalObj, item)
						);
						formik.setErrors(finalObj);
						return 'Lỗi! Không thể thêm sản phẩm!';
					}
				},
			});
		},
	});

	const handleClickIconEdit = () => {
		formik.setValues({
			id: product.id,
			name: product.name,
			wellKnownId: product.wellKnownId,
			description: product.description,
			categoryId: product.category.id,
			isActive: product.isActive,
			isRecommended: product.isRecommended
		});
		setEditing((prev) => !prev);
	};

	const fetchProduct = useCallback(async () => {
		const { status, data } = await axios.get(`/api/products/${id}`);
		if (status === 200 && data) {
			setProduct(data);
			setDetails(data.details);
			formik.setValues({
				id: data.id,
				name: data.name,
				wellKnownId: data.wellKnownId,
				description: data.description,
				categoryId: data.category.id,
				isActive: data.isActive,
				isRecommended: data.isRecommended
			});
		}
	}, [id]);

	useEffect(() => {
		document.title = 'Thông tin sản phẩm';

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

		const fetchListcategories = async () => {
			const { status, data } = await axios.get(
				'/api/categories?page=0&filter=active'
			);
			if (status === 200) {
				setcategories(
					data.categories.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
				formik.values.categoryId = product
					? product.categoryId
					: data.categories[0].id;
			}
		};

		try {
			fetchListcategories();
			fetchProduct();
			fetchImages();
		} catch (error) {
			if (error.response.status === 401) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
	}, [id, dispatch, fetchProduct, editing]);

	const handleDelete = async (id) => {
		try {
			ToastPromise(axios.delete(`/api/products/${id}`), {
				pending: 'Đang xóa sản phẩm',
				success: (response) => {
					navigate('/product', { replace: true });
					return <div>Đã xóa {product.name}</div>;
				},
				error: (error) => {
					return 'Lỗi! Không thể xóa sản phẩm!';
				},
			});
		} catch (error) {
			navigate('/');
		}
	};

	return product !== null && categories !== [] ? (
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
				{editing ? (
					<div>
						<UpLoadImage productId={product.id} />
					</div>
				) : (
					<div className={`${images.length === 0 && 'place-self-center'}`}>
						{images.length !== 0 ? (
							<ImageGallery
								items={images}
								lazyLoad={true}
								showNav={false}
								slideOnThumbnailOver={true}
							/>
						) : (
							<Button
								size={'xs'}
								onClick={() => setEditing(true)}
								gradientDuoTone={'greenToBlue'}>
								Thêm ảnh
								<FontAwesomeIcon icon={faPlus} className='pl-1' />
							</Button>
						)}
					</div>
				)}

				<Card className='relative col-span-1 md:col-span-2 self-start'>
					<div className='absolute md:top-3 md:right-3 invisible md:visible'>
						{!editing && (
							<Dropdown
								label='Tùy chọn'
								placement='left-start'
								gradientDuoTone={'cyanToBlue'}
								size={'xs'}>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										setEditing(true);
									}}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-blue-500'
										icon={faPenToSquare}
									/>
									Chỉnh sửa thông tin
								</Dropdown.Item>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										handleDelete(product.id);
									}}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-red-500'
										icon={faTrashCan}
									/>
									Xóa
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										navigate(`/product/${product.id}/detail`);
									}}>
									<FontAwesomeIcon
										icon={faPlusCircle}
										className='pr-1 w-4 h-4 text-green-500'
									/>
									Thêm chi tiết
								</Dropdown.Item>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										navigate(`/product/${product.id}/detail`);
									}}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-green-500'
										icon={faChartLine}
									/>
									Thống kê chi tiết
								</Dropdown.Item>
							</Dropdown>
						)}
					</div>

					<div className='flex gap-x-1 items-center'>
						{editing ? (
							<Fragment>
								<Checkbox
									name='isActive'
									id='isActive'
									checked={formik.values.isActive}
									onChange={formik.handleChange}
								/>
								<Label htmlFor='isActive' className='cursor-pointer'>
									Đang kinh doanh
								</Label>
								<Checkbox
									className='ml-2'
									name='isRecommended'
									id='isRecommended'
									checked={formik.values.isRecommended}
									onChange={formik.handleChange}
								/>
								<Label htmlFor='isRecommended' className='cursor-pointer'>
									Đề xuất sản phẩm
								</Label>
							</Fragment>
						) : (
							<Fragment>
								{product.isActive ? (
									<FilterBadge
										label='Đang kinh doanh'
										icon={faCheck}
										color={'success'}
									/>
								) : (
									<FilterBadge
										label='Đã ngừng kinh doanh'
										icon={faXmark}
										color={'failure'}
									/>
								)}
								{product.isRecommended && (
									<FilterBadge
										label='Sản phẩm được đề xuất'
										icon={faStar}
										color={'warning'}
									/>
								)}
							</Fragment>
						)}
					</div>
					<div className='gap-x-2 font-semibold items-center'>
						Sản phẩm:{' '}
						{!editing ? (
							<Fragment>
								<span className='text-md font-bold'>{formik.values.name}</span>
								<FontAwesomeIcon
									icon={faPencil}
									onClick={handleClickIconEdit}
									className={'w-3 h-4 ml-2 cursor-pointer hover:text-blue-600'}
								/>
							</Fragment>
						) : (
							<Fragment>
								<TextInput
									sizing={'md'}
									type={'text'}
									id={'name'}
									name={'name'}
									onChange={formik.handleChange}
									value={formik.values.name}
									placeholder={product.name}
									color={formik.touched.name && formik.errors.name && 'failure'}
									helperText={
										<span>
											{formik.touched.name && formik.errors.name && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.name}
												</span>
											)}
										</span>
									}
								/>
							</Fragment>
						)}
					</div>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-2'>
						<div className='font-semibold items-center'>
							<span>Mã sản phẩm: </span>
							{!editing ? (
								<Fragment>
									<span className='text-md font-bold'>
										{formik.values.wellKnownId}
									</span>
								</Fragment>
							) : (
								<Fragment>
									<TextInput
										sizing={'md'}
										type={'text'}
										id={'wellKnownId'}
										name={'wellKnownId'}
										onChange={formik.handleChange}
										value={formik.values.wellKnownId}
										placeholder={product.wellKnownId}
										color={
											formik.touched.wellKnownId &&
											formik.errors.wellKnownId &&
											'failure'
										}
										helperText={
											<span>
												{formik.touched.wellKnownId &&
													formik.errors.wellKnownId && (
														<span>
															<FontAwesomeIcon
																icon={faWarning}
																className='px-1'
															/>
															{formik.errors.wellKnownId}
														</span>
													)}
											</span>
										}
									/>
								</Fragment>
							)}
						</div>
						<div className='cursor-pointer font-semibold'>
							<span>Loại sản phẩm: </span>
							{!editing ? (
								<Fragment>
									<Link
										to={`/category/edit/${product.category.id}`}
										className='text-blue-500'>
										{product.category.name}
									</Link>
								</Fragment>
							) : (
								<Fragment>
									<SelectableInput
										id={'category'}
										defaultValue={categories.find(
											(category) => category.value === product.category.id
										)}
										isSearchable={true}
										onChange={(selected) => {
											formik.values.categoryId = selected.value;
										}}
										options={categories}
									/>
								</Fragment>
							)}
						</div>
						<div className='lg:col-span-2 gap-2'>
							{!editing ? (
								<div
									className='text-ellipsis'
									dangerouslySetInnerHTML={{
										__html: product.description,
									}}></div>
							) : (
								<TextEditor
									id={'description'}
									quillRef={quillRef}
									value={product.description}
								/>
							)}
						</div>
					</div>
					{editing ? (
						<div className='flex gap-x-1 self-center'>
							<Button
								size={'xs'}
								gradientDuoTone={'pinkToOrange'}
								onClick={handleClickIconEdit}>
								<FontAwesomeIcon icon={faXmark} className={'mr-1'} />
								Hủy
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								onClick={formik.handleSubmit}>
								<FontAwesomeIcon icon={faCheck} className={'mr-1'} />
								Lưu thay đổi
							</Button>
						</div>
					) : (
						<Fragment>
							{details.length !== 0 && (
								<Table hoverable={true}>
									<Table.Head>
										<Table.HeadCell>Loại</Table.HeadCell>
										<Table.HeadCell>Giá sỉ</Table.HeadCell>
										<Table.HeadCell>Giá lẻ</Table.HeadCell>
										<Table.HeadCell>Tồn</Table.HeadCell>
										<Table.HeadCell>Trạng thái</Table.HeadCell>
									</Table.Head>
									<Table.Body className='divide-y'>
										{details.map((item, index) => (
											<Table.Row
												onClick={() => {
													navigate(`/product/${id}/detail`);
												}}
												className='bg-white justify-center mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
												key={index}>
												<Table.Cell>{item.unit}</Table.Cell>
												<Table.Cell>
													{FormatCurrency(item.retailPrice)}
												</Table.Cell>
												<Table.Cell>
													{FormatCurrency(item.wholePrice)}
												</Table.Cell>
												<Table.Cell>{item.stock} kg</Table.Cell>
												<Table.Cell>
													{item.isAvailable ? (
														<Badge className='w-fit' color={'success'}>
															<FontAwesomeIcon
																icon={faCheck}
																className='mr-1'
															/>
															Đang kinh doanh
														</Badge>
													) : (
														<Badge color={'dark'}>
															<FontAwesomeIcon
																icon={faXmark}
																className='mr-1'
															/>
															Ngừng kinh doanh
														</Badge>
													)}
												</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table>
							)}
							<div className='flex gap-x-2 justify-between'>
								<Button
									size={'xs'}
									gradientDuoTone={'tealToLime'}
									onClick={() => {
										navigate(-1);
									}}>
									<FontAwesomeIcon
										icon={faArrowLeft}
										className='pr-2 w-4 h-4'
									/>
									Trở về
								</Button>
								<Link
									to={`/product/${id}/detail`}
									className={'self-center'}>
									<Button size={'xs'} gradientDuoTone={'greenToBlue'}>
										Thêm và chỉnh sửa chi tiết
										<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
									</Button>
								</Link>
							</div>
						</Fragment>
					)}
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
