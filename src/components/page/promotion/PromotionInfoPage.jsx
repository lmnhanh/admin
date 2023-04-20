import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faArrowRight,
	faBuildingUser,
	faCancel,
	faChartLine,
	faCheck,
	faClock,
	faClockFour,
	faHandshakeAlt,
	faHome,
	faMailBulk,
	faPencil,
	faPenToSquare,
	faPhone,
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
	Dropdown,
	Table,
	Textarea,
	TextInput,
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../product/imageGallery.css';
import ToastPromise from '../../util/ToastPromise';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FilterBadge from '../../util/FilterBadge';
import { FormatCurrency, ParseToDate } from '../../../libs/helper';
import InvoiceList from '../../list/InvoiceList';

export default function PromotionInfoPage(props) {
	const { id } = useParams();
	const [promotion, setPromotion] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchPromotion = useCallback(async () => {
		const { status, data } = await axios.get(`/api/promotions/${id}`);
		if (status === 200 && data) {
			setPromotion(data);
		}
	}, [id]);

	useEffect(() => {
		document.title = 'Thông tin khuyến mãi';

		try {
			fetchPromotion();
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
	}, [id, fetchPromotion, dispatch]);

	const handleDelete = async () => {
		ToastPromise(axios.delete(`/api/promotions/${promotion.id}`), {
			pending: 'Đang xóa khuyến mãi',
			success: (response) => {
				navigate('/promotion', { replace: true });
				return <div>Đã xóa {promotion.name}</div>;
			},
			error: (error) => {
				return 'Lỗi! Không thể xóa khuyến mãi!';
			},
		});
	};

	const handleDisable = async () => {
		ToastPromise(axios.put(`/api/promotions/${promotion.id}`), {
			pending: 'Đang ngừng áp dụng khuyến mãi',
			success: (response) => {
				return <div>Đã ngừng áp dụng {promotion.name}</div>;
			},
			error: (error) => {
				return 'Lỗi! Không thể ngừng áp dụng khuyến mãi!';
			},
		});
	};

	return promotion !== null ? (
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
					{ to: '/promotion', text: 'Khuyến mãi' },
					{ to: `/promotion/${id}`, text: 'Thông tin khuyến mãi' },
				]}
			/>

			<div className='container min-w-max'>
				<Card className='relative mb-2'>
					<div className='absolute md:top-3 md:right-3 invisible md:visible'>
						<Dropdown
							label='Tùy chọn'
							placement='left-start'
							gradientDuoTone={'cyanToBlue'}
							size={'xs'}>
							{promotion.isActive && (
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={handleDisable}>
									<FontAwesomeIcon
										className='pr-1 w-5 h-5 text-blue-500'
										icon={faXmark}
									/>
									Ngừng áp dụng
								</Dropdown.Item>
							)}
							<Dropdown.Item
								className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
								onClick={handleDelete}>
								<FontAwesomeIcon
									className='pr-1 w-4 h-4 text-red-500'
									icon={faTrashCan}
								/>
								Xóa khuyến mãi
							</Dropdown.Item>
						</Dropdown>
					</div>
					<div className='flex gap-x-1 items-center'>
						<Fragment>
							<FilterBadge
								label={`Ngày tạo ${ParseToDate(promotion.dateCreate)}`}
								icon={faClock}
								color={'indigo'}
							/>
							{!promotion.isActive && (
								<FilterBadge
									label={'Không khả dụng'}
									icon={faCancel}
									color={'gray'}
								/>
							)}
							{new Date(promotion.dateStart) <= new Date() &&
								new Date(promotion.dateEnd) >= new Date() && (
									<FilterBadge
										label={'Đang áp dụng'}
										icon={faCheck}
										color={'success'}
									/>
								)}

							{new Date(promotion.dateStart) > new Date() && (
								<FilterBadge
									label={'Sắp áp dụng'}
									icon={faClockFour}
									color={'info'}
								/>
							)}
							{new Date(promotion.dateEnd) < new Date() && (
								<FilterBadge
									label={'Ngưng áp dụng'}
									icon={faXmark}
									color={'failure'}
								/>
							)}
						</Fragment>
					</div>

					<div className='items-center'>
						<span className='font-semibold'>Khuyến mãi: </span>
						<span className='text-md font-bold'>{promotion.name}</span>
					</div>

					<div className={'grid grid-cols-2 gap-x-2'}>
						<div className='items-center'>
							<span className='font-semibold'>Mã khuyến mãi: </span>
							<span className='text-md'>{promotion.id}</span>
						</div>
						<div className={'items-center'}>
							<span className='font-semibold'>Mô tả bổ sung: </span>
							<span className='text-md'>{promotion.description}</span>
						</div>
						<div className={'items-center'}>
							<span className='font-semibold'>Số lượng hiện tại: </span>
							<span className='text-md'>{promotion.stock}</span>
						</div>
						<div className={'items-center flex gap-x-2'}>
							<span className='font-semibold'>Giá trị khuyến mãi: </span>
							<span className='text-md'>
								{promotion.isPercentage ? (
									<Badge color={'info'} className={'w-fit'}>
										{promotion.discount} % tối đa{' '}
										{FormatCurrency(promotion.maxDiscount)}
									</Badge>
								) : (
									<Badge color={'info'} className={'w-fit'}>
										{FormatCurrency(promotion.discount)}
									</Badge>
								)}
							</span>
						</div>
						<div className={'items-center'}>
							<span className='font-semibold'>Bắt đầu từ: </span>
							<span className='text-md'>
								{ParseToDate(promotion.dateStart)}
							</span>
						</div>
						<div className={'items-center'}>
							<span className='font-semibold'>Kết thúc vào: </span>
							<span className='text-md'>{ParseToDate(promotion.dateEnd)}</span>
						</div>
					</div>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
							<Table.HeadCell>Loại</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{promotion.products.map((item, index) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={item.id}
									onClick={() => navigate(`/product/${item.id}`)}>
									<Table.Cell>{item.id}</Table.Cell>
									<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
										{item.name}

										{item.isRecommended && (
											<FontAwesomeIcon
												icon={faStar}
												className='text-yellow-300 ml-1'
											/>
										)}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{item.category.name}
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					<div className='flex gap-x-2 justify-between'>
						<Button
							size={'xs'}
							gradientDuoTone={'tealToLime'}
							onClick={() => {
								navigate(-1);
							}}>
							<FontAwesomeIcon icon={faArrowLeft} className='pr-2 w-4 h-4' />
							Trở về
						</Button>
					</div>
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
