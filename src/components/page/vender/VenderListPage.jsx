import axios from 'axios';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
	Badge,
	Modal,
	Label,
	Select,
	Card,
	TextInput,
} from 'flowbite-react';
import Loader from '../../util/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleLeft,
	faAngleRight,
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
	setPageSize
} from '../../../libs/store/venderSlice';
import ReactPaginate from 'react-paginate';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { setAuthorized } from '../../../libs/store/slices';
import VenderList from '../../list/VenderList';

export default function VenderListPage(props) {
	const [venders, setVenders] = useState(null);
	const [showOption, setShowOption] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [totalVenders, setTotalVenders] = useState(0);

	
	const {order, sort, name, pageNo, pageSize } = useSelector((state) => state.vender);
	const searchInput = useRef({value: name});
	const dispatch = useDispatch();

	const SortOption = [
		{
			name: '',
			des: 'Id',
		},
		{
			name: 'name',
			des: 'Tên nhà cung cấp',
		},
		{
			name: 'invoice',
			des: 'Số hóa đơn',
		},
		{
			name: 'datestart',
			des: 'Ngày hợp tác',
		}
	];

	const fetchVenders = useCallback(async () => {
		try {
			const { data, status } = await axios.get(
				`/api/venders?name=${name}&page=${pageNo}&size=${pageSize}&sort=${sort}&order=${order}`
			);

			if (status === 200) {
				data.venders.length === 0 && dispatch(setPageNo(1));
				setTotalVenders(data.totalRows);
				setTotalPage(data.totalPages);
				setVenders(data.venders);
			}
		} catch (error) {
			error.response.status === 401 && dispatch(setAuthorized({ authorized: false }));
		}
	}, [pageNo, pageSize, sort, order, name, dispatch]);

	useEffect(()=>{
		document.title = 'Danh sách nhà cung cấp';
	},[])

	useEffect(() => {
		fetchVenders();
	}, [fetchVenders]);

	const handleSortOnClick = (prev) => {
		let nextIndex = SortOption.findIndex((opt) => opt.name === prev) + 1;
		dispatch(setSort(SortOption[nextIndex % SortOption.length].name));
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
					{ to: '/vender', text: 'Nhà cung cấp' },
				]}
			/>
			{venders === null ? (
				<Loader />
			) : (
				<div className='container min-w-max'>
					<Card>
						<div className='text-md font-bold items-center flex gap-2'>
							<span className='mr-3 min-w-fit'>Danh sách nhà cung cấp</span>
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
							<Badge className='min-w-max' color={'success'}>{totalVenders} nhà cung cấp</Badge>
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
								onChange={(event)=>{
									if(event.target.value.length === 0){
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

						<Modal
							show={showOption}
							dismissible={true}
							onClose={handleShowOption}
							size={'md'}>
							<Modal.Header>Lọc và sắp xếp</Modal.Header>
							<Modal.Body className='px-4 pt-3'>
								<div className='flex flex-col gap-1 mb-4'>
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
												<option value={'name'}>Tên nhà cung cấp</option>
												<option value={'invoice'}>Số lượng hóa đơn</option>
												<option value={'datestart'}>Ngày hợp tác</option>
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
						{venders.length !== 0 ? (
							<Fragment>
								<VenderList data={venders} highlightText={name} offset={(pageNo - 1) * pageSize}/>
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
											initialPage={pageNo-1}
											renderOnZeroPageCount={null}
										/>
									)}
									<Select
										sizing={'sm'}
										name='perpage'
										defaultValue={pageSize}
										onChange={(e) => handleChangePagesize(e.target.value)}
										className='w-fit h-fit mt-2 bg-gray-50 border text-middle border-gray-300 text-gray-900 text-sm rounded-lg'>
										<option value={5}>5 nhà cung cấp</option>
										<option value={10}>10 nhà cung cấp</option>
										<option value={15}>15 nhà cung cấp</option>
									</Select>
								</div>
							</Fragment>
						) : (
							<div className='text-center font-semibold'>Danh sách nhà cung cấp trống!</div>
						)}
					</Card>
				</div>
			)}
		</Fragment>
	);
}
