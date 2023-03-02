import { Sidebar } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShrimp, faTags } from '@fortawesome/free-solid-svg-icons';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import ProtectedRoute from '../auth/ProtectedRoute';

const activeClassName = 'bg-gradient-to-r from-cyan-200 to-blue-200'

export default function MainSidebar(props) {
	const { pathname } = useLocation();
	const collapsed = useSelector((state) => {
		return state.app.toggleSidebar;
	});

	return (
		<Sidebar collapsed={collapsed} className={'w-fit'}>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Sidebar.Item
						key={'Dashboard'}
						icon={() => <FontAwesomeIcon icon={faHome} />}
						as={Link}
						to={'/'}
						className={'/' === pathname ? activeClassName : ''}
						// onClick={() => mainRef.current?.scrollTo({ top: 0 })}
					>
						Dashboard
					</Sidebar.Item>
						<Sidebar.Item
							key={'Sản phẩm'}
							icon={() => <FontAwesomeIcon icon={faShrimp} />}
							as={Link}
							to={'/product'}
							className={pathname.includes('/product') ? activeClassName : ''}>
							Sản phẩm
						</Sidebar.Item>
					<ProtectedRoute role='user'>
						<Sidebar.Item
							key={'Loại sản phẩm'}
							icon={() => <FontAwesomeIcon icon={faTags} />}
							as={Link}
							to={'/category'}
							className={pathname.includes('/category') ? activeClassName: ''}>
							Loại sản phẩm
						</Sidebar.Item>
					</ProtectedRoute>
					<Sidebar.Item
						key={'Đăng nhập'}
						icon={() => <FontAwesomeIcon icon={faRightToBracket} />}
						as={Link}
						to={'/login'}
						className={'/login' === pathname ? 'bg-blue-200' : ''}>
						Đăng nhập
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
