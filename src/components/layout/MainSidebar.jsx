import { Sidebar } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavItems from './NavItems';
import { useSelector } from 'react-redux';

export default function MainSidebar(props) {
	const { pathname } = useLocation();
	const collapsed = useSelector((state) => {
		return state.app.toggleSidebar;
	});
	
	return (
		<Sidebar collapsed={collapsed}>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					{NavItems.map(({ href, icon, title }, key) => (
						<Sidebar.Item
							key={key}
							icon={icon}
							as={Link}
							to={href}
							className = {(href == pathname)? 'bg-blue-200' : ''}
							// onClick={() => mainRef.current?.scrollTo({ top: 0 })}
              >
							{title}
						</Sidebar.Item>
					))}
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
