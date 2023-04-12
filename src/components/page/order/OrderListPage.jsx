import axios from 'axios';
import React, {
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Badge, Modal, Label, Select, Card, TextInput } from 'flowbite-react';
import Loader from '../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleLeft,
	faAngleRight,
	faArrowRight,
	faFilter,
	faGear,
	faHome,
	faRotate,
	faSort,
	faSortAlphaDesc,
	faSortAlphaUpAlt,
} from '@fortawesome/free-solid-svg-icons';

import FilterBadge from '../../util/FilterBadge';
import { useSelector, useDispatch } from 'react-redux';
import {
	setUserName,
	setProductName,
	setFilter,
	setOptionToDefault,
	setFromDate,
	setToDate,
	setOrder,
	setPageNo,
	setSort,
	setPageSize,
	setFromPrice,
	setToPrice,
} from '../../../libs/store/orderSlice';
import ReactPaginate from 'react-paginate';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { setAuthorized } from '../../../libs/store/slices';
import OrderList from '../../list/OrderList';
import { FormatCurrency, ParseToDate } from '../../../libs/helper';
import SelectableInput from '../../util/SelectableInput';

export default function OrderListPage() {
	const [orders, setOrders] = useState(null);
	const [products, setProducts] = useState([{ value: '0', label: 'Tất cả' }]);
	const [showOption, setShowOption] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [totalOrders, setTotalOrders] = useState(0);

	const {
		order,
		sort,
		filter,
		userName,
		productName,
		fromDate,
		toDate,
		pageNo,
		fromPrice,
		toPrice,
		pageSize,
	} = useSelector((state) => state.order);

	const searchUserInput = useRef({ value: userName });
	const dispatch = useDispatch();

	const SortOption = [
		{
			name: '',
			des: 'Id',
		},
		{
			name: 'total',
			des: 'Tổng giá trị',
		},
		{
			name: 'datecreate',
			des: 'Ngày tạo',
		},
	];

	const FilterOption = [
		{
			name: '',
			des: 'Tất cả',
		},
		{
			name: 'processed',
			des: 'Đã xử lí',
		},
		{
			name: 'success',
			des: 'Thành công',
		},
		{
			name: 'fail',
			des: 'Thất bại',
		},
		{
			name: 'anonymous',
			des: 'Khách vãng lai',
		},
		{
			name: 'processing',
			des: 'Đang đợi xử lí',
		},
	];

	const fetchOrders = useCallback(async () => {
		try {
			const { data, status } = await axios.get(
				`/api/orders?filter=${filter}&userName=${userName}&productId=${productName}&fromDate=${fromDate}&toDate=${toDate}&fromPrice=${fromPrice}&toPrice=${toPrice}&page=${pageNo}&size=${pageSize}&sort=${sort}&order=${order}`
			);

			if (status === 200) {
				data.orders.length === 0 && dispatch(setPageNo(1));
				setTotalOrders(data.totalRows);
				setTotalPage(data.totalPages);
				setOrders(data.orders);
			}
		} catch (error) {
			(error.response.status === 401 || error.response.status === 403) &&
				dispatch(setAuthorized({ authorized: false }));
		}
	}, [
		pageNo,
		pageSize,
		sort,
		filter,
		order,
		userName,
		productName,
		toDate,
		fromDate,
		fromPrice,
		toPrice,
		dispatch,
	]);

	useEffect(() => {
		document.title = 'Danh sách đơn bán hàng';

		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts([
					{ value: '0', label: 'Tất cả' },
					...data.products.map((item) => ({
						value: item.id,
						label: item.name,
					})),
				]);
			}
		};

		fetchOrders();
		fetchProducts();
	}, [fetchOrders]);

	const handleSortOnClick = (prev) => {
		let nextIndex = SortOption.findIndex((opt) => opt.name === prev) + 1;
		dispatch(setSort(SortOption[nextIndex % SortOption.length].name));
	};

	const handleFilterOnClick = (prev) => {
		let nextIndex = FilterOption.findIndex((opt) => opt.name === prev) + 1;
		dispatch(setFilter(FilterOption[nextIndex % FilterOption.length].name));
	};

	const handleOrderOnClick = (prev) => {
		dispatch(setOrder(prev === 'desc' ? '' : 'desc'));
	};

	const handleChangePagesize = (pagesize) => {
		dispatch(setPageSize(pagesize));
	};

	const handlePageChange = (page) => {
		dispatch(setPageNo(page));
	};

	const handleUseSort = (value) => {
		handlePageChange(1);
		dispatch(setSort(value));
	};

	const handleUseVenderFilter = (value) => {
		handlePageChange(1);
		dispatch(setUserName(value));
	};

	const handleUseProductFilter = (value) => {
		handlePageChange(1);
		dispatch(setProductName(value));
	};

	const handleUseFromPrice = (value) => {
		handlePageChange(1);
		dispatch(setFromPrice(value));
	};

	const handleUseToPrice = (value) => {
		handlePageChange(1);
		dispatch(setToPrice(value));
	};

	const handleUseFromDate = (value) => {
		handlePageChange(1);
		dispatch(setFromDate(value));
	};

	const handleUseToDate = (value) => {
		handlePageChange(1);
		dispatch(setToDate(value));
	};

	const handleUseOrder = (value) => {
		handlePageChange(1);
		dispatch(setOrder(value));
	};

	const handleSetOptionToDefault = () => {
		handlePageChange(1);
		dispatch(setOptionToDefault());
	};

	const handleShowOption = () => {
		setShowOption((prev) => !prev);
	};

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
					{ to: '/order', text: 'Đơn bán hàng' },
				]}
			/>
			{orders === null ? (
				<Loader />
			) : (
				<div className='container relative min-w-max'>
					<Card>
						<div className='text-md font-bold items-center flex gap-2'>
							<span className='min-w-fit mr-3'>Danh sách đơn bán hàng</span>
							{FilterOption.map(
								(opt, index) =>
									filter === opt.name && (
										<FilterBadge
											key={index}
											color={'purple'}
											label={opt.des}
											handleOnClose={() => handleFilterOnClick(filter)}
											icon={faFilter}
										/>
									)
							)}
							{fromDate !== '' && toDate !== '' && (
								<FilterBadge
									color={'purple'}
									label={`${ParseToDate(fromDate, 1)} đến ${ParseToDate(
										toDate,
										1
									)}`}
									handleOnClose={() => handleShowOption()}
									icon={faFilter}
								/>
							)}
							{Number.parseInt(fromPrice) !== -1 ? (
								<FilterBadge
									color={'purple'}
									label={`Từ ${FormatCurrency(fromPrice)}${
										Number.parseInt(toPrice) !== -1
											? ` đến ${FormatCurrency(toPrice)}`
											: ''
									}`}
									handleOnClose={() => handleShowOption()}
									icon={faFilter}
								/>
							) : (
								Number.parseInt(toPrice) !== -1 && (
									<FilterBadge
										color={'purple'}
										label={`Dưới ${FormatCurrency(toPrice)}`}
										handleOnClose={() => handleShowOption()}
										icon={faFilter}
									/>
								)
							)}
							{SortOption.map(
								(opt, index) =>
									sort === opt.name && (
										<FilterBadge
											key={index}
											color={'info'}
											label={opt.des}
											handleOnClose={() => handleSortOnClick(sort)}
											icon={faSort}
										/>
									)
							)}

							{order === 'desc' && (
								<FilterBadge
									color={'warning'}
									label='Giảm dần'
									handleOnClose={() => handleOrderOnClick(order)}
									icon={faSortAlphaDesc}
								/>
							)}
							{order === '' && (
								<FilterBadge
									color={'warning'}
									label='Tăng dần'
									handleOnClose={() => handleOrderOnClick(order)}
									icon={faSortAlphaUpAlt}
								/>
							)}
							<Badge className='min-w-max' color={'success'}>
								{totalOrders} đơn
							</Badge>
							<Badge
								color={'purple'}
								size={'xs'}
								onClick={handleShowOption}
								className={'cursor-pointer'}>
								<FontAwesomeIcon icon={faGear} />
							</Badge>
							<Badge
								color={'purple'}
								onClick={handleSetOptionToDefault}
								className={'cursor-pointer'}
								size={'xs'}>
								<FontAwesomeIcon icon={faRotate} />
							</Badge>
							<TextInput
								className='font-medium'
								type={'search'}
								spellCheck={false}
								ref={searchUserInput}
								defaultValue={userName}
								sizing={'sm'}
								maxLength={30}
								autoFocus={true}
								onChange={(event) => {
									if (event.target.value.length === 0) {
										event.preventDefault();
										dispatch(setUserName(event.target.value));
									}
								}}
								onKeyDown={(event) => {
									if (event.key === 'Enter') {
										event.preventDefault();
										dispatch(setUserName(event.target.value));
									}
								}}
								placeholder={'Tìm kiếm khách hàng'}
							/>
						</div>

						<Modal
							show={showOption}
							position={'top-center'}
							dismissible={true}
							onClose={handleShowOption}
							size={'lg'}>
							<Modal.Header>Lọc và sắp xếp</Modal.Header>
							<Modal.Body className='px-4 pt-3'>
								<div className='grid grid-cols-2 gap-2'>
									<div>
										<Label>Tên khách hàng:</Label>
										<input
											className='rounded-md h-fit text-sm focus:border-blue-500 ring-2 focus:ring-blue-300 w-full'
											type={'search'}
											spellCheck={false}
											ref={searchUserInput}
											defaultValue={userName}
											maxLength={20}
											autoFocus={true}
											onChange={(event) => {
												if (event.target.value.length === 0) {
													event.preventDefault();
													dispatch(setUserName(event.target.value));
												}
											}}
											onKeyDown={(event) => {
												if (event.key === 'Enter') {
													event.preventDefault();
													dispatch(setUserName(event.target.value));
												}
											}}
											placeholder={'Tìm kiếm'}
										/>
									</div>
									<div>
										<Label>Sản phẩm:</Label>
											<SelectableInput
											defaultValue={{ value: '0', label: 'Tất cả' }}
											isSearchable={true}
											onChange={(selected) => {
												handleUseProductFilter(selected.value);
											}}
											options={products}
										/>
										
									</div>
									<div>
										<Label>Giá trị từ:</Label>
										<Select
											sizing={'sm'}
											value={fromPrice}
											onChange={(e) => handleUseFromPrice(e.target.value)}>
											<option value={-1}>Tất cả</option>
											<option value={500000}>{FormatCurrency(500000)}</option>
											<option value={1000000}>{FormatCurrency(1000000)}</option>
											<option value={5000000}>{FormatCurrency(5000000)}</option>
											<option value={10000000}>
												{FormatCurrency(10000000)}
											</option>
										</Select>
									</div>
									<div>
										<Label>Đến:</Label>
										<Select
											sizing={'sm'}
											value={toPrice}
											onChange={(e) => handleUseToPrice(e.target.value)}>
											<option value={-1}>Tất cả</option>
											<option value={500000}>{FormatCurrency(500000)}</option>
											<option value={1000000}>{FormatCurrency(1000000)}</option>
											<option value={5000000}>{FormatCurrency(5000000)}</option>
											<option value={10000000}>
												{FormatCurrency(10000000)}
											</option>
										</Select>
									</div>
									<div>
										<Label>Ngày tạo từ:</Label>
										<TextInput
											type={'date'}
											sizing={'sm'}
											onChange={(e) => {
												handleUseFromDate(
													e.target.value || new Date().toISOString()
												);
											}}
										/>
									</div>
									<div>
										<Label>Đến:</Label>
										<TextInput
											type={'date'}
											sizing={'sm'}
											onChange={(e) => {
												handleUseToDate(
													e.target.value || new Date().toISOString()
												);
											}}
										/>
									</div>
									<div>
										<Label htmlFor='sort'>Sắp xếp theo:</Label>
										<Select
											id='sort'
											sizing={'sm'}
											value={sort}
											onChange={(e) => handleUseSort(e.target.value)}>
											<option value={''}>Id</option>
											<option value={'total'}>Tổng giá trị</option>
											<option value={'datecreate'}>Ngày tạo</option>
										</Select>
									</div>
									<div>
										<Label htmlFor='order'>Thứ tự:</Label>
										<Select
											id='order'
											sizing={'sm'}
											value={order}
											onChange={(e) => handleUseOrder(e.target.value)}>
											<option value={''}>Tăng dần</option>
											<option value={'desc'}>Giảm dần</option>
										</Select>
									</div>
								</div>
							</Modal.Body>
						</Modal>
						{orders.length !== 0 ? (
							<Fragment>
								<OrderList
									data={orders}
									offset={(pageNo - 1) * pageSize}
									highlightText={userName}
								/>
								<div className='fixed w-full bg-white bottom-0 self-center flex justify-center'>
									{totalPage !== 1 && (
										<ReactPaginate
											className='flex items-center rounded-md w-fit self-center m-2 gap-1'
											breakLabel='...'
											nextLabel={
												<FontAwesomeIcon
													icon={faAngleRight}
													className='w-10 py-1'
												/>
											}
											nextClassName={'text-gray-500 font-bold text-center'}
											previousLabel={
												<FontAwesomeIcon
													icon={faAngleLeft}
													className='w-10 py-1'
												/>
											}
											previousClassName={'text-center text-gray-500 font-bold'}
											onPageChange={(e) => handlePageChange(e.selected + 1)}
											pageClassName={
												'border border-gray-300 rounded flex items-center justify-center'
											}
											activeClassName={
												'bg-blue-200 bg-gradient-to-br text-blue-600 font-semibold'
											}
											pageLinkClassName={'w-10 py-1 text-center align-middle'}
											pageRangeDisplayed={2}
											pageCount={totalPage}
											initialPage={pageNo - 1}
											renderOnZeroPageCount={null}
										/>
									)}
									<Select
										sizing={'sm'}
										name='perpage'
										defaultValue={pageSize}
										onChange={(e) => handleChangePagesize(e.target.value)}
										className='w-fit h-fit mt-2 mr-5 bg-gray-50 border text-middle border-gray-300 text-gray-900 text-sm rounded-lg'>
										<option value={10}>10 đơn</option>
										<option value={25}>25 đơn</option>
										<option value={50}>50 đơn</option>
									</Select>
								</div>
							</Fragment>
						) : (
							<div className='text-center font-semibold'>
								Danh sách đơn nhập trống!
							</div>
						)}
					</Card>
				</div>
			)}
		</Fragment>
	);
}
