import { useEffect } from 'react';
import OverallOrderRevenue from './statistic/Overall/OrverallOrderRevenue';
import OverallInvoiceCost from './statistic/Overall/OrverallInvoiceCost';
import OverallOrderNew from './statistic/Overall/OrverallOrderNew';
import OverallCustomerNew from './statistic/Overall/OrverallCustomerNew';
import OverallOrderStatus from './statistic/Overall/OrverallOrderStatus';
import HotestProduct from './statistic/Overall/HotestProduct';
import SellSlowlyProduct from './statistic/Overall/SellSlowlyProduct';
export default function Dashboard() {
	useEffect(() => {
		document.title = 'Trang chủ';
	}, []);

	return (
		<div className='flex flex-wrap gap-2'>
			<OverallOrderRevenue />
			<OverallInvoiceCost />
			<OverallOrderNew />
			<OverallCustomerNew />
			<OverallOrderStatus />
			<HotestProduct />
			<SellSlowlyProduct />
		</div>
	);
}
