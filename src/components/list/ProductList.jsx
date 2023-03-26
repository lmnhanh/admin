import {
	faAngleLeft,
	faAngleRight,
	faCheck,
	faFilter,
	faGear,
	faRotate,
	faSort,
	faSortAlphaDesc,
	faSortAlphaUpAlt,
	faStar,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
	Badge,
	Table,
	Card,
	TextInput,
	Modal,
	Select,
	Label,
} from 'flowbite-react';
import React, {
	Fragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import Highlighter from 'react-highlight-words';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ParseToDate } from '../../libs/helper';
import {
	setFilter,
	setName,
	setOptionToDefault,
	setOrder,
	setPageNo,
	setPageSize,
	setSort,
} from '../../libs/store/productSlice';
import { setAuthorized } from '../../libs/store/slices';
import FilterBadge from '../util/FilterBadge';
import Loader from './../util/Loader';

export default function ProductList({ categoryId = '' }) {
	const [products, setproducts] = useState(null);
	const [showOption, setShowOption] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [totalproducts, setTotalproducts] = useState(0);

	const { filter, order, sort, name, pageNo, pageSize } = useSelector(
		(state) => state.product
	);
	const searchInput = useRef({ value: name });
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		{
			name: 'recommended',
			des: 'Được đề xuất',
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
		try {
			const { data, status } = await axios.get(
				`/api/products?name=${name}&page=${pageNo}&size=${pageSize}&filter=${filter}&sort=${sort}&order=${order}` +
					(categoryId && `&categoryId=${categoryId}`)
			);

			if (status === 200) {
				data.products.length === 0 && dispatch(setPageNo(1));
				setTotalproducts(data.totalRows);
				setTotalPage(data.totalPages);
				setproducts(data.products);
			}
		} catch (error) {
			error.response.status === 401 &&
				dispatch(setAuthorized({ authorized: false }));
		}
	}, [pageNo, pageSize, filter, sort, order, name, dispatch]);

	useEffect(() => {
		document.title = 'Danh sách loại sản phẩm';
	}, []);

	useEffect(() => {
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
		dispatch(setPageSize(pagesize));
	};

	const handlePageChange = (page) => {
		dispatch(setPageNo(page));
	};

	const handleUseFilter = (value) => {
		handlePageChange(1);
		dispatch(setPageNo(1));
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

	const handleShowOption = () => {
		setShowOption((prev) => !prev);
	};

	return products === null ? (
		<Loader size='lg' />
	) : (
		<Card>
			<div className='text-md font-bold items-center flex gap-2'>
				<span className='mr-3 min-w-fit'>Danh sách sản phẩm</span>
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
				<Badge className='min-w-max' color={'success'}>{totalproducts} sản phẩm</Badge>
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
			{products.length !== 0 ? (
				<Fragment>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
							<Table.HeadCell>Loại</Table.HeadCell>
							<Table.HeadCell>Trạng thái</Table.HeadCell>
							<Table.HeadCell>Ngày cập nhật</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{products.map((item, index) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={item.id}
									onClick={() => navigate(`/product/${item.id}`)}>
									<Table.Cell>{item.id}</Table.Cell>
									<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
										<Highlighter
											highlightClassName='bg-blue-300'
											searchWords={name.split(' ')}
											autoEscape={true}
											textToHighlight={item.name}
										/>

										{item.isRecommended && (
											<FontAwesomeIcon
												icon={faStar}
												className='text-yellow-300 ml-1'
											/>
										)}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{item.category.name}
									</Table.Cell>
									<Table.Cell>
										{item.isActive ? (
											<Badge className='min-w-max' color={'success'}>
												<FontAwesomeIcon icon={faCheck} className='mr-1' />
												Đang kinh doanh
											</Badge>
										) : (
											<Badge className='min-w-max'>
												<FontAwesomeIcon icon={faXmark} className='mr-1' />
												Ngừng kinh doanh
											</Badge>
										)}
									</Table.Cell>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
										{ParseToDate(item.dateUpdate)}
									</Table.Cell>
									{/* <Table.Cell>
							<Dropdown label='Tùy chọn' color={'gray'} size={'xs'}>
							<Dropdown.Item>
									<Link
										to={`/product/${item.id}`}
										className='w-full hover:text-blue-600'>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-blue-500'
											icon={faInfoCircle}
										/>
										Thông tin
									</Link>
								</Dropdown.Item>
								<Dropdown.Item>
									<Link
										to={`/product/${item.id}`}
										className='w-full hover:text-blue-600'>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-blue-500'
											icon={faPenToSquare}
										/>
										Chi tiết
									</Link>
								</Dropdown.Item>
								<Dropdown.Item>
									<Link
										to={`/product/${item.id}`}
										className='w-full hover:text-blue-600'>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-red-500'
											icon={faTrashCan}
										/>
										Xóa
									</Link>
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item>
									<FontAwesomeIcon
										icon={faPlusCircle}
										className='pr-1 w-4 h-4 text-green-500'
									/>
									Thêm sản phẩm
								</Dropdown.Item>
							</Dropdown>
						</Table.Cell> */}
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					<div className='fixed w-full self-center bg-white bottom-0 flex justify-center'>
						{totalPage !== 1 && (
							<ReactPaginate
								className='flex items-center rounded-md w-fit self-center m-2 gap-1'
								breakLabel='...'
								nextLabel={
									<FontAwesomeIcon icon={faAngleRight} className='w-10 py-1' />
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
							<option value={'5'}>5 sản phẩm</option>
							<option value={'15'}>15 sản phẩm</option>
							<option value={'25'}>25 sản phẩm</option>
							<option value={'50'}>50 sản phẩm</option>
						</Select>
					</div>
				</Fragment>
			) : (
				<div className='text-center font-semibold'>Danh sách sản phẩm trống!</div>
			)}
		</Card>
	);
}
