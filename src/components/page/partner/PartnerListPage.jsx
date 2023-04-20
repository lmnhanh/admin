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
import ToastPromise from '../../util/ToastPromise'
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
	setOptionToDefault,
	setOrder,
	setPageNo,
	setSort,
	setPageSize,
	setFilter,
} from '../../../libs/store/partnerSlice';
import ReactPaginate from 'react-paginate';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { setAuthorized } from '../../../libs/store/slices';
import TradingPartnerList from '../../list/TradingPartnerList';

export default function TradingPartnerListPage(props) {
	const [partners, setPartners] = useState(null);
	const [showOption, setShowOption] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [totalPartners, setTotalPartners] = useState(0);

	const { order, sort, name, pageNo, pageSize, filter, fromDate, toDate } =
		useSelector((state) => state.partner);
	const searchInput = useRef({ value: name });
	const dispatch = useDispatch();

	const SortOption = [
		{
			name: '',
			des: 'Id',
		},
		{
			name: 'dateaspartner',
			des: 'Ngày hợp tác',
		},
	];

	const FilterOption = [
		{
			name: '',
			des: 'Tất cả',
		},
		{
			name: 'pending',
			des: 'Đợi xử lí',
		},
		{
			name: 'emailConfirmed',
			des: 'Chưa xác nhận email',
		}
	];

	const fetchUsers = useCallback(async () => {
		try {
			const { data, status } = await axios.get(
				`/api/users/with_info?filter=${filter}&name=${name}&fromDate=${fromDate}&toDate=${toDate}&page=${pageNo}&size=${pageSize}&sort=${sort}&order=${order}`
			);

			if (status === 200) {
				data.partners.length === 0 && dispatch(setPageNo(1));
				setTotalPartners(data.totalRows);
				setTotalPage(data.totalPages);
				setPartners(data.partners);
			}
		} catch (error) {
			error.response.status === 401 &&
				dispatch(setAuthorized({ authorized: false }));
		}
	}, [pageNo, pageSize, sort, filter, order, name, dispatch]);

	useEffect(() => {
		document.title = 'Danh sách nhà cung cấp';
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleDelete = (id) => {
		ToastPromise(axios.delete(`/api/users/${id}`), {
			pending: 'Đang xóa thông tin đối tác',
			success: () => {
				fetchUsers();
				return <div>Đã xóa thông tin đối tác</div>;
			},
			error: () => {
				return 'Lỗi! Không thể xóa đối tác này!';
			},
		});
	}

	const handleProcessed = (id) => {
		ToastPromise(axios.put(`/api/users/${id}/processed`), {
			pending: 'Đang cập nhật thông tin',
			success: () => {
				fetchUsers();
				return <div>Đã cập nhật thông tin đối tác</div>;
			},
			error: () => {
				return 'Lỗi! Không thể cập nhật thông tin!';
			},
		});
	}

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

	const handleUseOrder = (value) => {
		handlePageChange(1);
		dispatch(setOrder(value));
	};

	const handleUseFilter = (value) => {
		handlePageChange(1);
		dispatch(setFilter(value));
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
					{ to: '/trading_partner', text: 'Đối tác bán hàng' },
				]}
			/>
			{partners === null ? (
				<Loader />
			) : (
				<div className='container min-w-max'>
					<Card>
						<div className='text-md font-bold items-center flex gap-2'>
							<span className='mr-3 min-w-fit'>Danh sách đối tác bán hàng</span>
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
							<Badge className='min-w-max' color={'success'}>
								{totalPartners} nhà cung cấp
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
								ref={searchInput}
								defaultValue={searchInput.current.value}
								sizing={'sm'}
								maxLength={20}
								autoFocus={true}
								spellCheck={false}
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
								placeholder={'Tìm theo tên hoặc email'}
							/>
						</div>

						<Modal
							show={showOption}
							dismissible={true}
							onClose={handleShowOption}
							size={'lg'}>
							<Modal.Header>Lọc và sắp xếp</Modal.Header>
							<Modal.Body className='px-4 pt-3'>
								<div className='grid grid-cols-2 gap-2'>
									<div className='w-full'>
										<Label>Lọc theo:</Label>
										<Select
											id='sort'
											sizing={'sm'}
											value={filter}
											onChange={(e) => handleUseFilter(e.target.value)}>
											{FilterOption.map((opt, index) => (
												<option key={index} value={opt.name}>
													{opt.des}
												</option>
											))}
										</Select>
									</div>
									<div className='w-full'>
										<Label>Sắp xếp theo:</Label>
										<Select
											id='sort'
											sizing={'sm'}
											value={sort}
											onChange={(e) => handleUseSort(e.target.value)}>
											{SortOption.map((opt, index) => (
												<option key={index} value={opt.name}>
													{opt.des}
												</option>
											))}
										</Select>
									</div>
									<div className='w-full'>
										<Label>Thứ tự:</Label>
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
							</Modal.Body>
						</Modal>
						{partners.length !== 0 ? (
							<Fragment>
								<TradingPartnerList
									onDelete={handleDelete}
									onProcessed={handleProcessed}
									data={partners}
									highlightText={name}
									offset={(pageNo - 1) * pageSize}
								/>
								<div className='fixed w-full self-center bg-white bottom-0 flex justify-center'>
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
										className='w-fit h-fit mt-2 bg-gray-50 border text-middle border-gray-300 text-gray-900 text-sm rounded-lg'>
										<option value={10}>10 đối tác</option>
										<option value={25}>25 đối tác</option>
										<option value={40}>40 đối tác</option>
									</Select>
								</div>
							</Fragment>
						) : (
							<div className='text-center font-semibold'>
								Danh sách nhà cung cấp trống!
							</div>
						)}
					</Card>
				</div>
			)}
		</Fragment>
	);
}
