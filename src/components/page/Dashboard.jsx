import { useEffect } from 'react';
import OverallOrderRevenue from './statistic/OrverallOrderRevenue';
import OverallInvoiceCost from './statistic/OrverallInvoiceCost';
import OverallOrderNew from './statistic/OrverallOrderNew';
import OverallOrderStatus from './statistic/OrverallOrderStatus';
import { Fragment } from 'react';
import OverallCustomerNew from './statistic/OrverallCustomerNew';
import HotestProduct from './statistic/HotestProduct';
import SellSlowlyProduct from './statistic/SellSlowlyProduct';

export default function Dashboard() {

	useEffect(() => {
		document.title = 'Trang chủ';
	}, []);

	return (
		<Fragment>
			<div className='flex flex-wrap gap-2'>
				<OverallOrderRevenue />
				<OverallInvoiceCost/>
				<OverallOrderNew/>
				<OverallCustomerNew/>
				<OverallOrderStatus/>
				<HotestProduct/>
				<SellSlowlyProduct/>
			</div>
		</Fragment>
	);
}
