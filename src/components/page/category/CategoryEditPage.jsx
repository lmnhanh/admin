import {
	faArrowLeft,
	faCheck,
	faHome,
	faPencilAlt,
	faTrashAlt,
	faWarning,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
	Badge,
	Button,
	Card,
	Checkbox,
	Label,
	TextInput,
} from 'flowbite-react';
import { useFormik } from 'formik';
import { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../util/Loader';
import * as Yup from 'yup';
import ToastPromise from '../../util/ToastPromise';
import { ParseToDate } from './../../../libs/helper';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import NotFound404 from './../../util/NotFound404';
import ProductList from '../../list/ProductList';
import Swal from 'sweetalert2';

export default function CategoryEditPage(props) {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);

	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			id: id,
			name: '',
			isActive: true,
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.min(2, 'Tên loại hải sản phải nhiều hơn 2 kí tự')
				.max(50, 'Tên loại không vượt quá 50 kí tự')
				.required('Tên loại không được trống'),
		}),
		onSubmit: async (values) => {
			Swal.fire({
				title: values.name,
				text: 'Xác nhận cập nhật loại sản phẩm',
				icon: 'question',
				confirmButtonColor: '#108506',
				confirmButtonText: 'Cập nhật',
			}).then((result) => {
				result.isConfirmed &&
					ToastPromise(axios.put(`/api/categories/${id}`, values), {
						pending: 'Đang lưu chỉnh sửa',
						success: (response) => {
							setLoading(true);
							setEditing(false);
							return `Đã lưu chỉnh sửa`;
						},
						error: (error) => {
							let errors = error.response.data.errors.join(', ');
							return errors;
						},
					});
			});
		},
	});

	const handleToggleEdit = () => {
		formik.values.id = category.id;
		formik.values.name = category.name;
		formik.values.isActive = category.isActive;
		formik.setErrors({ name: undefined });
		setEditing((prev) => !prev);
	};

	const handleOnDelete = async () => {
		Swal.fire({
			title: category.name,
			text: 'Xác nhận xóa loại sản phẩm',
			icon: 'question',
			confirmButtonColor: '#d33',
			confirmButtonText: 'Xóa',
		}).then((result) => {
			result.isConfirmed &&
				ToastPromise(axios.delete(`/api/categories/${id}`), {
					pending: 'Đang xóa loại hải sản',
					success: (response) => {
						if (response.status === 204 && response.data === '') {
							navigate('/category');
						}
						return `Đã xóa ${category.name}`;
					},
					error: (error) => {
						let errors = error.response.data.errors.join(', ');
						return errors;
					},
				});
		});
	};

	useEffect(() => {
		document.title = 'Thông tin loại hải sản';
		const fetchData = async () => {
			try {
				const response = await axios.get(`/api/categories/${id}`);
				const { status, data } = response;
				if (status === 200) {
					setCategory(data);
				}
			} catch (error) {
				error.response.status === 404 && setCategory(null);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id, loading]);

	return loading ? (
		<Loader />
	) : category ? (
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
					{ to: '/category', text: 'Loại sản phẩm' },
					{ to: `/category/edit/${id}`, text: category.name },
				]}
			/>
			<div className='container relative'>
				<Card className='mb-2'>
					{!editing && (
						<Button
							size={'xs'}
							onClick={handleToggleEdit}
							gradientDuoTone={'greenToBlue'}
							className='md:w-fit absolute md:top-3 md:right-3 invisible md:visible'>
							<FontAwesomeIcon icon={faPencilAlt} className='w-3 h-3 mr-1' />
							Chỉnh sửa
						</Button>
					)}
					<div className='text-md font-bold flex gap-2'>
						<span className='mr-3'>Thông tin loại hải sản</span>
					</div>
					<div className='flex justify-center '>
						<div
							className={`sm:w-full md:w-3/4 lg:w-3/5 grid-flow-row-dense grid grid-cols-3 items-center place-content-start ${
								editing ? 'gap-2' : 'gap-1'
							}`}>
							<div className='font-semibold'>Mã loại:</div>
							<div className='col-span-2'>#{category.id}</div>
							<div className='font-semibold'>Tên loại:</div>
							{editing ? (
								<div className='col-span-2 w-full'>
									<TextInput type='hidden' name='id' value={formik.values.id} />
									<TextInput
										type='text'
										id='name'
										name='name'
										autoFocus={true}
										color={'gray'}
										className=''
										sizing={'sm'}
										onChange={formik.handleChange}
										value={formik.values.name}
									/>
									<div className='text-red-600 self-center text-sm'>
										{formik.touched.name && formik.errors.name && (
											<span className='block'>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.name}
											</span>
										)}
									</div>
								</div>
							) : (
								<div className='col-span-2 w-full'>{category.name}</div>
							)}
							<div className='font-semibold'>Trạng thái:</div>
							{editing ? (
								<div className='flex gap-2 items-center col-span-2'>
									<Checkbox
										name='isActive'
										id='isActive'
										checked={formik.values.isActive}
										onChange={formik.handleChange}
									/>
									<Label htmlFor='isActive' className='cursor-pointer'>
										Đang kinh doanh
									</Label>
								</div>
							) : (
								<div className='col-span-2'>
									{category.isActive ? (
										<Badge color={'info'} className='w-fit'>
											<FontAwesomeIcon icon={faCheck} className='mr-1' />
											Đang kinh doanh
										</Badge>
									) : (
										<Badge color={'failure'} className='w-fit'>
											<FontAwesomeIcon icon={faXmark} className='mr-1' />
											Ngừng kinh doanh
										</Badge>
									)}
								</div>
							)}
							{!editing && (
								<>
									<div className='font-semibold'>Ngày cập nhật:</div>
									<div className='col-span-2'>
										{ParseToDate(category.dateUpdate)}
									</div>
								</>
							)}
						</div>
					</div>
					{editing ? (
						<div className='flex justify-center items-center gap-2'>
							<Button
								size={'xs'}
								className='w-fit'
								gradientDuoTone={'pinkToOrange'}
								onClick={handleToggleEdit}>
								<FontAwesomeIcon icon={faXmark} className='h-4 w-4 mr-1' />
								Hủy
							</Button>
							<Button
								size={'xs'}
								className='w-fit'
								gradientDuoTone={'greenToBlue'}
								onClick={formik.handleSubmit}>
								<FontAwesomeIcon icon={faCheck} className='h-4 w-4 mr-1' />
								Lưu thay đổi
							</Button>
						</div>
					) : (
						<div className='flex justify-center gap-2'>
							<Button
								className='w-fit h-8 rounded-lg text-center'
								size={'xs'}
								onClick={() => {
									navigate(-1);
								}}
								gradientDuoTone={'tealToLime'}>
								<FontAwesomeIcon icon={faArrowLeft} className='pr-2 w-4 h-4' />
								Trở về
							</Button>
							<Button
								className='w-fit h-8 rounded-lg text-center'
								onClick={handleOnDelete}
								size={'xs'}
								gradientDuoTone={'pinkToOrange'}>
								<FontAwesomeIcon icon={faTrashAlt} className='pr-2 w-4 h-4' />
								Xóa
							</Button>
						</div>
					)}
				</Card>
				<ProductList categoryId={id} />
			</div>
		</Fragment>
	) : (
		<NotFound404 />
	);
}
