import { faBars, faChartLine, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from 'flowbite-react';
import { Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PromotionMainPage() {
	return (
		<Fragment>
			<div className='flex gap-2'>
				<Link to={'/promotion'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách khuyến mãi
					</Button>
				</Link>
				<Link to={'/promotion/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Button
					size={'xs'}
					gradientDuoTone={'cyanToBlue'}
					// onClick={handleToggleAddModal}
					className='w-fit h-8 rounded-lg text-center min-w-max'>
					<FontAwesomeIcon icon={faPlus} className='pr-2 w-4 h-4' />
					Thêm khuyến mãi
				</Button>
			</div>
			<Outlet />
		</Fragment>
	);
}
