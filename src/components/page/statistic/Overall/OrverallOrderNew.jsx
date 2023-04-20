import {
	faArrowRight,
	faBoxesPacking,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Badge, Card } from 'flowbite-react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../../libs/store/slices';
import Loader from '../../../util/Loader';
import { useNavigate } from 'react-router-dom';

export default function OverallOrderNew() {
	const [orderNew, setOrderNew] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchOverallOrderNew = async () => {
			try {
				const { status, data } = await axios.get('/api/orders/statistic/new');
				if (status === 200) {
					setOrderNew(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchOverallOrderNew();
	}, []);
	return (
		<Card className='min-w-min relative grow'>
			<span
				onClick={() => navigate('/order')}
				className='absolute text-sm font-semibold right-4 top-3 hover:text-blue-700 text-blue-500 cursor-pointer'>
				Chi tiết
				<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
			</span>
			<span className='text-md font-bold'>Đơn hàng mới</span>
			{orderNew === null ? (
				<Loader />
			) : (
				<div className='flex flex-wrap'>
					<div className='shadow-sm grow flex p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faBoxesPacking}
							size='3x'
							className={`drop-shadow-sm text-blue-500`}
						/>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'warning'}>
								Đang đợi xử lí
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>{orderNew.waiting}</span>{' '}
								đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'purple'}>
								Tuần này
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>{orderNew.thisWeek}</span>{' '}
								đơn
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'info'}>
								Tháng này
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{orderNew.thisMonth}
								</span>{' '}
								đơn
							</span>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
