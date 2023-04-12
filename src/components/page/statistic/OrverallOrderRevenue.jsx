import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Badge } from 'flowbite-react';
import { faArrowRight, faDollar } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { FormatCurrency } from '../../../libs/helper';
import { useState } from 'react';
import { setAuthorized } from '../../../libs/store/slices';
import axios from 'axios';

export default function OverallOrderRevenue() {
	const [orderRevenue, setOrderRevenue] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchOverallOrderRevenue = async () => {
			try {
				const { status, data } = await axios.get(
					'/api/orders/statistic/revenue'
				);
				if (status === 200) {
					setOrderRevenue(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchOverallOrderRevenue();
	}, []);
	return (
		<Card className='min-w-min flex-auto relative'>
			<span className='absolute text-sm font-semibold right-4 top-3 hover:text-blue-700 text-blue-500 cursor-pointer'>
				Chi tiết
				<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
			</span>

			<span className='text-md font-bold'>Tổng danh thu bán hàng</span>
			{orderRevenue === null ? (
				<Loader />
			) : (
				<Fragment>
					<div className='shadow-sm flex p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faDollar}
							size='3x'
							className={`drop-shadow-sm text-yellow-300`}
						/>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'success'}>
								Hôm nay
							</Badge>
							{FormatCurrency(orderRevenue.today)}
						</div>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'purple'}>
								Tuần này
							</Badge>
							{FormatCurrency(orderRevenue.thisWeek)}
						</div>
						<div className='grow flex flex-col font-semibold'>
							<Badge size={'xs'} color={'info'}>
								Tháng này
							</Badge>
							{FormatCurrency(orderRevenue.thisMonth)}
						</div>
					</div>
				</Fragment>
			)}
		</Card>
	);
}
