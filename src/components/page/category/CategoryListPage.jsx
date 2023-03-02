import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Badge,
	Modal,
	Label,
	Select,
	Breadcrumb,
	Card,
	Button,
} from 'flowbite-react';
import Loader from '../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleLeft,
	faAngleRight,
	faFilter,
	faGear,
	faHome,
	faPlus,
	faRotate,
	faSort,
	faSortAlphaDesc,
	faSortAlphaUpAlt,
} from '@fortawesome/free-solid-svg-icons';

import FilterBadge from '../../util/FilterBadge';
import { Link, useNavigate } from 'react-router-dom';
import CategoryList from '../../list/CategoryList';
import NewCateforyPage from './NewCategoryPage';
import { useSelector, useDispatch } from 'react-redux';
import {
	setFilter,
	setOptionToDefault,
	setOrder,
	setSort,
} from '../../../libs/store/categorySlice';
import ReactPaginate from 'react-paginate';
import BreadcrumbPath from './../../util/BreadCrumbPath';

export default function CategoryListPage(props) {
	const [categories, setCategories] = useState([]);
	const [showOption, setShowOption] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [pageNo, setPageNo] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [totalCategories, setTotalCategories] = useState(0);
	const [pagesize, setPagesize] = useState(5);

	const navigate = useNavigate();

	const { filter, order, sort } = useSelector((state) => ({
		filter: state.category.filter,
		order: state.category.order,
		sort: state.category.sort,
	}));
	const dispatch = useDispatch();

	const FilterOption = [
		{
			name: '',
			des: 'Tất cả',
		},
		{
			name: 'active',
			des: 'Đang kinh doanh',
		},
		{
			name: 'unactive',
			des: 'Ngừng kinh doanh',
		},
	];

	const SortOption = [
		{
			name: '',
			des: 'Id',
		},
		{
			name: 'name',
			des: 'Tên loại',
		},
		{
			name: 'dateupdate',
			des: 'Ngày cập nhật',
		},
	];

	const fetchData = useCallback(async () => {
		//try {
			const response = await axios.get(
				`/api/categories?page=${pageNo}&size=${pagesize}&filter=${filter}&sort=${sort}&order=${order}`
			);

			const { data, status } = response;
			if (status === 200) {
				data.categories.length === 0 && setPageNo(1);
				setTotalCategories(data.totalRows);
				setTotalPage(data.totalPages);
				setCategories(data.categories);
			}
		// } catch (errors) {
		// 	navigate('/login',{replace : true})
		// }
	}, [pageNo, pagesize, filter, sort, order]);

	useEffect(() => {
		document.title = 'Danh sách loại sản phẩm';
		fetchData();
	}, [fetchData]);

	const handleFilterOnClick = (prev) => {
		let nextIndex = FilterOption.findIndex((opt) => opt.name === prev) + 1;
		dispatch(setFilter(FilterOption[nextIndex % FilterOption.length].name));
	};

	const handleSortOnClick = (prev) => {
		let nextIndex = SortOption.findIndex((opt) => opt.name === prev) + 1;
		dispatch(setSort(SortOption[nextIndex % SortOption.length].name));
	};

	const handleOrderOnClick = (prev) => {
		dispatch(setOrder(prev === 'desc' ? '' : 'desc'));
	};

	const handleChangePagesize = (pagesize) => {
		setPagesize(pagesize);
	};

	const handlePageChange = (page) => {
		setPageNo(page);
	};

	const handleUseFilter = (value) => {
		handlePageChange(1);
		setPageNo(1);
		dispatch(setFilter(value));
	};

	const handleUseSort = (value) => {
		handlePageChange(1);
		dispatch(setSort(value));
	};

	const handleUseOrder = (value) => {
		handlePageChange(1);
		dispatch(setOrder(value));
	};

	const handleSetOptionToDefault = () => {
		handlePageChange(1);
		dispatch(setOptionToDefault());
	};

	const handleGetNewestUpdate = () => {
		handlePageChange(1);
		setShowAddModal(false);
		dispatch(setOptionToDefault());
		fetchData();
	};

	const handleShowOption = () => {
		setShowOption((prev) => !prev);
	};

	const handleShowAddModal = () => {
		setShowAddModal((prev) => !prev);
	};

	return (
		<div>
			<BreadcrumbPath items={[
				{to: '/', text: <><FontAwesomeIcon icon={faHome} /> Home</>, },
				{to: '/category', text: 'Loại sản phẩm' }
			]}/>
			
			<Modal
				show={showAddModal}
				dismissible={true}
				size={'sm'}
				onClose={handleShowAddModal}>
				<Modal.Header>Thêm loại hải sản</Modal.Header>
				<Modal.Body>
					<NewCateforyPage handleOnSuccess={handleGetNewestUpdate} />
				</Modal.Body>
			</Modal>

			{categories.length === 0 ? (
				<Loader size={'lg'} />
			) : (
				<div className='container relative'>
					<Card>
						<Button
							size={'xs'}
							gradientDuoTone={'greenToBlue'}
							onClick={handleShowAddModal}
							className='md:w-fit absolute md:top-3 md:right-3 xs:hidden'>
							<FontAwesomeIcon icon={faPlus} className='w-4 h-4 mr-1' />
							Thêm loại
						</Button>
						<div className='text-md font-bold flex gap-2'>
							<span className='mr-3'>Danh sách loại hải sản</span>

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
							<Badge color={'success'}>{totalCategories} loại</Badge>
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
						</div>

						<Modal
							show={showOption}
							dismissible={true}
							onClose={handleShowOption}
							size={'md'}>
							<Modal.Header>Lọc và sắp xếp</Modal.Header>
							<Modal.Body className='px-4 pt-3'>
								<div className='flex flex-col gap-1 mb-4'>
									<div className='block'>
										<Label>Lọc:</Label>
									</div>
									<Select
										id='filter'
										sizing={'sm'}
										value={filter}
										onChange={(e) => handleUseFilter(e.target.value)}>
										<option value={''}>Không</option>
										<option value={'active'}>Đang kinh doanh</option>
										<option value={'unactive'}>Ngừng kinh doanh</option>
									</Select>
									<div className='flex gap-2'>
										<div className='w-full'>
											<div className='block'>
												<Label>Sắp xếp theo:</Label>
											</div>
											<Select
												id='sort'
												sizing={'sm'}
												value={sort}
												onChange={(e) => handleUseSort(e.target.value)}>
												<option value={''}>Id</option>
												<option value={'name'}>Tên loại</option>
												<option value={'dateupdate'}>Ngày cập nhật</option>
											</Select>
										</div>
										<div className='w-full'>
											<div className='block'>
												<Label>Thứ tự:</Label>
											</div>
											<Select
												id='Order'
												sizing={'sm'}
												value={order}
												onChange={(e) => handleUseOrder(e.target.value)}>
												<option value={''}>Tăng dần</option>
												<option value={'desc'}>Giảm dần</option>
											</Select>
										</div>
									</div>
								</div>
							</Modal.Body>
						</Modal>

						<CategoryList data={categories} />
						<div className='flex justify-center'>
							{totalPage !== 1 && (
								// <Pagination
								// 	className='mt-0 pt-0'
								// 	currentPage={pageNo}
								// 	onPageChange={handlePageChange}
								// 	previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
								// 	nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
								// 	totalPages={totalPage}
								// />
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
										<FontAwesomeIcon icon={faAngleLeft} className='w-10 py-1' />
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
									renderOnZeroPageCount={null}
								/>
							)}
							<Select
								sizing={'sm'}
								name='perpage'
								onChange={(e) => handleChangePagesize(e.target.value)}
								className='w-fit h-fit mt-2 bg-gray-50 border text-middle border-gray-300 text-gray-900 text-sm rounded-lg'>
								<option value={'5'}>5 loại</option>
								<option value={'10'}>10 loại</option>
								<option value={'15'}>15 loại</option>
							</Select>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
