import {
	faArrowRight,
	faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Badge, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../../libs/store/slices';
import Loader from '../../../util/Loader';
import { useNavigate } from 'react-router-dom';

export default function OverallCustomerNew() {
	const [customerNew, setCustomerNew] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchOverallCustomerNew = async () => {
			try {
				const { status, data } = await axios.get('/api/users/statistic/new');
				if (status === 200) {
					setCustomerNew(data);
				}
			} catch (error) {
				(error.response.status === 401 || error.response.status === 403) &&
					dispatch(setAuthorized(false));
			}
		};

		fetchOverallCustomerNew();
	}, []);
	return (
		<Card className='min-w-min relative grow'>
			<span
				onClick={() => navigate('/customer')}
				className='absolute text-sm font-semibold right-4 top-3 hover:text-blue-700 text-blue-500 cursor-pointer'>
				Chi tiết
				<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
			</span>
			<span className='text-md font-bold'>Đối tác bán hàng</span>
			{customerNew === null ? (
				<Loader />
			) : (
				<div className='flex flex-wrap'>
					<div className='shadow-sm grow flex p-2 gap-x-2 rounded-md'>
						<FontAwesomeIcon
							icon={faUserFriends}
							size='3x'
							className={`drop-shadow-sm text-blue-500`}
						/>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'warning'}>
								Đợi xét duyệt
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>{customerNew.pending}</span> đang đợi
							</span>
						</div>
					</div>
					<div className='shadow-sm grow flex p-2 gap-x-2 rounded-md'>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'purple'}>
								Tuần này
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>{customerNew.thisWeek}</span> đối tác mới
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'info'}>
								Tháng này
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>
									{customerNew.thisMonth}
								</span>	đối tác mới
							</span>
						</div>
						<div className='grow min-w-fit flex flex-col font-semibold items-center'>
							<Badge size={'xs'} color={'warning'}>
								Tổng số
							</Badge>
							<span className='text-sm'>
								<span className='text-lg text-center'>{customerNew.total}</span> đối tác
							</span>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
