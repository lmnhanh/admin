import {
	faArrowRight,
	faUserCheck,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Badge, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import Loader from '../../util/Loader';
import { useNavigate } from 'react-router-dom';

export default function OverallOrderStatus() {
	const [orderStatus, setOrderStatus] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchOverallOrderStatus = async () => {
			try {
				const { status, data } = await axios.get(
					'/api/orders/statistic/status'
				);
				if (status === 200) {
					setOrderStatus(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchOverallOrderStatus();
	}, [dispatch]);
	return (
		<Card className='min-w-min relative grow'>
			<span
				onClick={() => navigate('/order')}
				className='absolute text-sm font-semibold right-4 top-3 hover:text-blue-700 text-blue-500 cursor-pointer'>
				Chi tiết
				<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
			</span>

			<span className='text-md font-bold'>Trạng thái đơn hàng</span>
			{orderStatus === null ? (
				<Loader />
			) : (
				<div className='flex flex-wrap gap-x-5'>
					<div className='shadow-sm flex grow p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faUserCheck}
							size='3x'
							className={`drop-shadow-sm text-green-500`}
						/>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'success'}>
								Hôm nay
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.today.success}
								</span> đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'success'}>
								7 ngày qua
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.thisWeek.success}
								</span> đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'success'}>
								30 ngày qua
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.thisMonth.success}
								</span> đơn
							</span>
						</div>
					</div>
					<div className='shadow-sm flex grow p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faXmark}
							size='3x'
							className={`drop-shadow-sm text-red-600 w-12 h-12`}
						/>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'failure'}>
								Hôm nay
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.today.fail}
								</span> đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'failure'}>
								7 ngày qua
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.thisWeek.fail}
								</span> đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'failure'}>
								30 ngày qua
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderStatus.thisMonth.fail}
								</span> đơn
							</span>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
