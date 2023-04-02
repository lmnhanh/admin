import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';
import { Fragment} from 'react';
import { Link, Outlet} from 'react-router-dom';
import {
	faBars,
	faChartLine,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';

export default function OrderMainPage(props) {
	return (
		<Fragment>
			<div className='flex gap-2'>
				<Link to={'/order'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách đơn bán hàng
					</Button>
				</Link>
				<Link to={'/order/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Link to={'/order/new'}>
					<Button
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}
						className='w-fit h-8 rounded-lg text-center min-w-max'>
						<FontAwesomeIcon icon={faPlus} className='pr-2 w-4 h-4' />
						Thêm đơn bán hàng
					</Button>
				</Link>
			</div>
			<Outlet />
		</Fragment>
	);
}
