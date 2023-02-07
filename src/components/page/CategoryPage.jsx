import { Breadcrumb, Card, Button, Table, TextInput } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CategoryList from './../list/CategoryList';

export default function CategoryPage(props) {
	return (
		<div>
			<Breadcrumb className='rounded py-3 px-5'>
				<Breadcrumb.Item>
					<Link to={'/'}>
						<FontAwesomeIcon icon={faHome} /> Home
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Loại sản phẩm</Breadcrumb.Item>
			</Breadcrumb>
			<div className='container'>
				<Card>
					<h5 className='text-lg font-bold'>
						Danh sách loại sản phẩm
					</h5>
					<CategoryList/>
				</Card>
			</div>
		</div>
	);
}
