import { Sidebar } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChartColumn,
	faGift, faHome,
	faPaperPlane,
	faPeopleArrows,
	faReceipt,
	faShrimp,
	faTags,
	faTruckArrowRight,
	faUserFriends,
	faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const activeClassName = 'bg-gradient-to-r from-cyan-200 to-blue-200';

export default function MainSidebar(props) {
	const { pathname } = useLocation();
	const collapsed = useSelector((state) => {
		return state.app.toggleSidebar;
	});

	return (
		<Sidebar collapsed={collapsed} className={'max-w-max z-10'}>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faHome} />}
						as={Link}
						to={'/'}
						className={'/' === pathname ? activeClassName : ''}
						// onClick={() => mainRef.current?.scrollTo({ top: 0 })}
					>
						Dashboard
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faTruckArrowRight} />}
						as={Link}
						to={'/order'}
						className={pathname.includes('/order') ? activeClassName : ''}>
						Đơn bán hàng
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faShrimp} />}
						as={Link}
						to={'/product'}
						className={pathname.includes('/product') ? activeClassName : ''}>
						Sản phẩm
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faWarehouse} className={'w-4 h-4'} />}
						as={Link}
						to={'/stock'}
						className={pathname.includes('/stock') ? activeClassName : ''}>
						Kho
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faReceipt} className={'w-4 h-4'}/>}
						as={Link}
						to={'/invoice'}
						className={pathname.includes('/invoice') ? activeClassName : ''}>
						Hóa đơn nhập
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faGift} />}
						as={Link}
						to={'/promotion'}
						className={pathname.includes('/promotion') ? activeClassName : ''}>
						Khuyến mãi
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faUserFriends} className={'w-4 h-4'} />}
						as={Link}
						to={'/trading_partner'}
						className={pathname.includes('/trading_partner') ? activeClassName : ''}>
						Đối tác bán hàng
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faPeopleArrows} className={'w-4 h-4'} />}
						as={Link}
						to={'/vender'}
						className={pathname.includes('/vender') ? activeClassName : ''}>
						Nhà cung cấp
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faChartColumn} className={'w-4 h-4'} />}
						as={Link}
						to={'/statistic/profit'}
						className={pathname.includes('/statistic') ? activeClassName : ''}>
						Thống kê
					</Sidebar.Item>
					<Sidebar.Item
						icon={() => <FontAwesomeIcon icon={faTags} />}
						as={Link}
						to={'/category'}
						className={pathname.includes('/category') ? activeClassName : ''}>
						Loại sản phẩm
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
