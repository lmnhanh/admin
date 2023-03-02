import { Breadcrumb, Pagination } from 'flowbite-react';
import { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Loader from '../../util/Loader';
import axios from 'axios';
import { Pie, PieChart, ResponsiveContainer, Tooltip  } from 'recharts';
import BreadcrumbPath from './../../util/BreadCrumbPath';

export default function CategoryOverallPage(props) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});

	const fetchData = async () => {
		const response = await axios.post('/api/categories/overall');
		const { data, status } = response;
		if (status === 200) {
			setLoading(false);
			console.log(data);
			setData(data);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const data01 = [
		{
			name: 'Group A',
			value: 400,
		},
		{
			name: 'Group B',
			value: 300,
		},
		{
			name: 'Group C',
			value: 300,
		},
		{
			name: 'Group D',
			value: 200,
		},
		{
			name: 'Group E',
			value: 278,
		},
		{
			name: 'Group F',
			value: 189,
		},
	];
	const data02 = [
		{
			name: 'Group A',
			value: 2400,
		},
		{
			name: 'Group B',
			value: 4567,
		},
		{
			name: 'Group C',
			value: 1398,
		},
		{
			name: 'Group D',
			value: 9800,
		},
		{
			name: 'Group E',
			value: 3908,
		},
		{
			name: 'Group F',
			value: 4800,
		},
	];

	return (
		<Fragment>
			<BreadcrumbPath items={[
				{to: '/', text: <><FontAwesomeIcon icon={faHome} /> Home</>, },
				{to: '/category', text: 'Loại sản phẩm' },
				{to: '/category/overall', text: 'Thống kê tổng quan' },
			]}/>
			{loading ? (
				<Loader size='lg' text='Đang tải ...' />
			) : (
				<div className='container relative'>
						<PieChart width={220} height={220}>
							<Pie
								dataKey='value'
								name='name'
								isAnimationActive={true}
								data={data}
								cx='50%'
								cy='50%'
								outerRadius={100}
								fill='#8884d8'
								label
							/>
							<Tooltip />
						</PieChart>
				</div>
			)}
		</Fragment>
	);
}
