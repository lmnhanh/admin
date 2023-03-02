import { Breadcrumb } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function BreadcrumbPath({ items }) {
	return (
		<Breadcrumb className='rounded py-3 px-5'>
			{items.map((item, index) => (
				<Breadcrumb.Item key={index}>
					<Link to={item.to} className={'hover:text-blue-600'}>{item.text}</Link>
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	);
}
