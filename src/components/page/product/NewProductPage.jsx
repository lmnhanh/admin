import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import { Card } from 'flowbite-react';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { useEffect, React, Fragment } from 'react';
import ProductModify from './ProductModify';

export default function NewProductPage({ products }) {
	useEffect(() => {
		document.title = 'Thêm sản phẩm';
	}, []);

	return (
		<Fragment>
			<BreadcrumbPath
				items={[
					{
						to: '/',
						text: (
							<>
								<FontAwesomeIcon icon={faHome} /> Home
							</>
						),
					},
					{ to: '/product', text: 'Sản phẩm' },
					{ to: '/product/new', text: 'Thêm sản phẩm mới' },
				]}
			/>

			<div className='container'>
				<Card>
					<span className='mr-3 text-md font-bold'>Thêm sản phẩm mới</span>
					<ProductModify />
				</Card>
			</div>
		</Fragment>
	);
}
