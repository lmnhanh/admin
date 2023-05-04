import SideBar from '../../layout/shop/Sidebar';
import { Outlet } from 'react-router-dom';
import HotProduct from './product/HotProduct';

export default function ShopIndex() {
	return (
		<main>
			<div className='flex'>
				<SideBar />
				<div>
					<Outlet></Outlet>
				</div>
			</div>
			<HotProduct />
		</main>
	);
}
