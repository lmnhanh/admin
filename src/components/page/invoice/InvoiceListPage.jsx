import React, { Fragment, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import BreadcrumbPath from '../../util/BreadCrumbPath';
import InvoiceList from './../../list/InvoiceList';

export default function InvoiceListPage() {
	useEffect(() => {
		document.title = 'Danh sách đơn nhập hàng';
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
					{ to: '/vender', text: 'Nhà cung cấp' },
				]}
			/>
			<InvoiceList />
		</Fragment>
	);
}
