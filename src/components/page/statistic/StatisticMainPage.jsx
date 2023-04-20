import {
	faDollarSign, faLineChart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';
import { Fragment } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function StatisticMainPage() {
	const navigate = useNavigate();
	const {pathname } = useLocation();
	const normalColor = 'gray'
	const activeColor = 'cyanToBlue'
	return (
		<Fragment>
			<div className='flex flex-wrap gap-2 mb-2'>
				<Button
					onClick={() => navigate('/statistic/profit')}
					className='h-8 rounded-lg shadow-md text-center min-w-max'
					size={'sm'}
					
					gradientDuoTone={pathname.includes('c/profit')? activeColor : normalColor}>
					<FontAwesomeIcon icon={faDollarSign} className='mr-1 h-4 w-4' />
					Thống kê lợi nhuận
				</Button>
				<Button
					onClick={() => navigate('/statistic/prices')}
					className='h-8 rounded-lg shadow-md text-center min-w-max'
					size={'sm'}
					gradientDuoTone={pathname.includes('/prices')? activeColor : normalColor}>
					<FontAwesomeIcon icon={faLineChart} className='mr-1 h-4 w-4' />
					Lịch sử biến động giá
				</Button>
			</div>
			<Outlet />
		</Fragment>
	);
}
