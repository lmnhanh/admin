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
	setName,
	setProductId,
	setFilter,
	setOptionToDefault,
	setFromDate,
	setToDate,
	setOrder,
	setPageNo,
	setSort,
	setPageSize,
} from '../../../libs/store/promotionSlice';
import ReactPaginate from 'react-paginate';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { setAuthorized } from '../../../libs/store/slices';
import { ParseToDate } from '../../../libs/helper';
import SelectableInput from '../../util/SelectableInput';
import PromotionList from '../../list/PromotionList';

export default function PromotionListPage() {
	const [promotions, setPromotions] = useState(null);
	const [products, setProducts] = useState([{ value: '0', label: 'Tất cả' }]);
	const [showOption, setShowOption] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [totalPromotions, setTotalPromotions] = useState(0);

	const {
		order,
		sort,
		filter,
		name,
		type,
		productId,
		fromDate,
		toDate,
		pageNo,
		pageSize,
	} = useSelector((state) => state.promotion);

	const searchUserInput = useRef({ value: name });
	const dispatch = useDispatch();

	const SortOption = [
		{
			name: '',
			des: 'Id',
		},
		{
			name: 'datecreate',
			des: 'Ngày tạo',
		},
		{
			name: 'product',
			des: 'Sản phẩm áp dụng',
		},
	];

	const FilterOption = [
		{
			name: '',
			des: 'Tất cả',
		},
		{
			name: 'takingplace',
			des: 'Đang áp dụng',
		},
		{
			name: 'incoming',
			des: 'Sắp áp dụng',
		},
		{
			name: 'passed',
			des: 'Ngưng áp dụng',
		},
		{
			name: 'unavailable',
			des: 'Không khả dụng',
		},
	];

	const fetchPromotions = useCallback(async () => {
		try {
			const { data, status } = await axios.get(
				`/api/promotions?filter=${filter}&name=${name}&productId=${productId}&type=${type}&fromDate=${fromDate}&toDate=${toDate}&page=${pageNo}&size=${pageSize}&sort=${sort}&order=${order}`
			);

			if (status === 200) {
				data.promotions.length === 0 && dispatch(setPageNo(1));
				setTotalPromotions(data.totalRows);
				setTotalPage(data.totalPages);
				setPromotions(data.promotions);
			}
		} catch (error) {
			(error.response.status === 401 || error.response.status === 403) &&
				dispatch(setAuthorized({ authorized: false }));
		}
	}, [
		pageNo,
		pageSize,
		type,
		sort,
		filter,
		order,
		name,
		productId,
		toDate,
		fromDate,
		dispatch,
	]);

	useEffect(() => {
		document.title = 'Danh sách khuyến mãi';

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

		fetchPromotions();
		fetchProducts();
	}, [fetchPromotions]);

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
		dispatch(setName(value));
	};

	const handleUseProductFilter = (value) => {
		handlePageChange(1);
		dispatch(setProductId(value));
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
					{ to: '/promotion', text: 'Khuyến mãi' },
				]}
			/>
			{promotions === null ? (
				<Loader />
			) : (
				<div className='container relative min-w-max'>
					<Card>
						<div className='text-md font-bold items-center flex gap-2'>
							<span className='min-w-fit mr-3'>Danh sách khuyến mãi</span>
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
								{totalPromotions} khuyến mãi
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
							{filter !== 'anonymous' && (
								<TextInput
									className='font-medium'
									type={'search'}
									spellCheck={false}
									ref={searchUserInput}
									defaultValue={name}
									sizing={'sm'}
									maxLength={30}
									autoFocus={true}
									onChange={(event) => {
										if (event.target.value.length === 0) {
											event.preventDefault();
											dispatch(setName(event.target.value));
										}
									}}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											event.preventDefault();
											dispatch(setName(event.target.value));
										}
									}}
									placeholder={'Tìm kiếm khách hàng'}
								/>
							)}
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
											className='rounded-md h-fit text-sm focus:bpromotion-blue-500 ring-2 focus:ring-blue-300 w-full'
											type={'search'}
											spellCheck={false}
											ref={searchUserInput}
											defaultValue={name}
											maxLength={20}
											autoFocus={true}
											onChange={(event) => {
												if (event.target.value.length === 0) {
													event.preventDefault();
													dispatch(setName(event.target.value));
												}
											}}
											onKeyDown={(event) => {
												if (event.key === 'Enter') {
													event.preventDefault();
													dispatch(setName(event.target.value));
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
						{promotions.length !== 0 ? (
							<Fragment>
								<PromotionList
									data={promotions}
									offset={(pageNo - 1) * pageSize}
									highlightText={name}
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
												'bpromotion bpromotion-gray-300 rounded flex items-center justify-center'
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
										className='w-fit h-fit mt-2 mr-5 bg-gray-50 bpromotion text-middle bpromotion-gray-300 text-gray-900 text-sm rounded-lg'>
										<option value={10}>10 khuyến mãi</option>
										<option value={25}>25 khuyến mãi</option>
										<option value={50}>50 khuyến mãi</option>
									</Select>
								</div>
							</Fragment>
						) : (
							<div className='text-center font-semibold'>
								Danh sách khuyến mãi trống!
							</div>
						)}
					</Card>
				</div>
			)}
		</Fragment>
	);
}
