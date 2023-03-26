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
	faChartLine,
	faCheck,
	faClock,
	faDollar,
	faHandshakeAlt,
	faHome,
	faMailBulk,
	faPencil,
	faPenToSquare,
	faPhone,
	faPlusCircle,
	faTrashCan,
	faWarning,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
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

export default function InvoiceInfoPage(props) {
	const { id } = useParams();
	const [invoice, setInvoice] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchInvoice = useCallback(async () => {
		const { status, data } = await axios.get(`/api/invoices/${id}`);
		if (status === 200 && data) {
			setInvoice(data);
		}
	}, [id]);

	useEffect(() => {
		document.title = 'Thông tin đơn nhập hàng';
		try {
			fetchInvoice();
		} catch (error) {
			if (error.response.status === 401) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
	}, [id, fetchInvoice, dispatch]);

	return invoice !== null ? (
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
					{ to: '/invoice', text: 'Đơn nhập hàng' },
					{ to: `/invoice/${id}`, text: 'Thông tin đơn nhập hàng' },
				]}
			/>

			<div className='container min-w-max'>
				<Card className='relative'>
					<div className='flex gap-x-1 items-center'>
						<Fragment>
							<FilterBadge
								label={FormatCurrency(invoice.realTotal)}
								icon={faDollar}
								color={'success'}
							/>
							<FilterBadge
								label={ParseToDate(invoice.dateCreate)}
								icon={faClock}
								color={'info'}
							/>
						</Fragment>
					</div>
					<div className='items-center'>
						<span className='font-semibold'>Đơn nhập từ: </span>
						<span className='text-md font-bold'>{invoice.vender.name}</span>
					</div>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Sản phẩm</Table.HeadCell>
							<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
							<Table.HeadCell>Giá nhập</Table.HeadCell>
							<Table.HeadCell>Số lượng nhập</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{invoice.invoiceDetails.map((item, index) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={index}>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{item.productDetail.productName}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{item.productDetail.unit}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{FormatCurrency(item.productDetail.importPrice)}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{item.quantity} kg
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					<Button size={'xs'} className={'w-fit'} gradientDuoTone={'tealToLime'} onClick={()=>{navigate(-1)}}>
						<FontAwesomeIcon icon={faArrowLeft} className="mr-1"/>
						Trở về
					</Button>
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
