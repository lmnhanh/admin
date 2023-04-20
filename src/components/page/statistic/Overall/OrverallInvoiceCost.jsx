import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Badge } from 'flowbite-react';
import {
	faArrowRight,
	faDollar,
	faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { FormatCurrency } from '../../../../libs/helper';
import { useState } from 'react';
import { setAuthorized } from '../../../../libs/store/slices';
import axios from 'axios';

export default function OverallInvoiceCost() {
	const [invoiceCost, setInvoiceCost] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchOverallInvoiceCost = async () => {
			try {
				const { status, data } = await axios.get(
					'/api/invoices/statistic/cost'
				);
				if (status === 200) {
					setInvoiceCost(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchOverallInvoiceCost();
	}, []);
	return (
		<Card className='min-w-min flex-auto relative'>
			<span className='absolute text-sm font-semibold right-4 top-3 hover:text-blue-700 text-blue-500 cursor-pointer'>
				Chi tiết
				<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
			</span>

			<span className='text-md font-bold'>Tổng chi phí nhập hàng</span>
			{invoiceCost === null ? (
				<Loader />
			) : (
				<Fragment>
					<div className='shadow-sm flex p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faFileInvoiceDollar}
							size='3x'
							className={`drop-shadow-sm text-red-600`}
						/>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'success'}>
								Hôm nay
							</Badge>
							{FormatCurrency(invoiceCost.today)}
						</div>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'purple'}>
								Tuần này
							</Badge>
							{FormatCurrency(invoiceCost.thisWeek)}
						</div>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'info'}>
								Tháng này
							</Badge>
							{FormatCurrency(invoiceCost.thisMonth)}
						</div>
					</div>
				</Fragment>
			)}
		</Card>
	);
}
