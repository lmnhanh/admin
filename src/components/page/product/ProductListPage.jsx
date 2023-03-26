import React from 'react';
import Loader from '../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import ProductList from './../../list/ProductList';
import BreadcrumbPath from './../../util/BreadCrumbPath';

export default function ProductListPage() {
	return (
		<div>
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
				]}
			/>
			<div className='container min-w-max'>
				<ProductList />
			</div>
		</div>
	);
}
