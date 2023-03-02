import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';
import { Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { faBars, faChartLine} from '@fortawesome/free-solid-svg-icons';

export default function ProductMainPage(props) {
	return (
		<Fragment>
			<div className='flex gap-2'>
				<Link to={'/product'}>
					<Button
						className='w-fit h-8 rounded-lg text-center'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách sản phẩm
					</Button>
				</Link>
        <Link to={'/product/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
			</div>
			<Outlet />
		</Fragment>
	);
}
