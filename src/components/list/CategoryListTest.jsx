import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown, Pagination, Table, TextInput } from 'flowbite-react';
import Loader from '../page/Loader';
import EditableCategory from '../EditableCategory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function CategoryListTest(props) {
	const [state, setState] = useState({
		data: [],
		loading: true,
	});

	const [editId, setEditId] = useState(0);
	const [pageNo, setPageNo] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [pagesize, setPagesize] = useState(5);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		fetchData();
	}, [editing, pageNo, pagesize]);

	const fetchData = async () => {
		const response = await axios.get(
			`https://localhost:7028/api/categories?page=${pageNo}&size=${pagesize}`
		);
		const { data, status } = response;
		if (status == '200') {
			setTotalPage(data.totalPages);
			setState({
				data: data.categories,
				loading: false,
			});
		}
	};

	const handlePageChange = (page) => {
		setPageNo(page);
	};

	const handleEdit = (id) => {
		setEditId(id);
		setEditing(true);
	};

	const handleCancelEdit = () => {
		setEditId(0);
		setEditing(false);
	};

	return state.loading ? (
		<Loader />
	) : (
		<>
			<div className='text-md font-bold'>
				{editing ? 'Cập nhật thông tin' : 'Danh sách loại sản phẩm'}
			</div>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>#</Table.HeadCell>
					<Table.HeadCell>Tên loại</Table.HeadCell>
					<Table.HeadCell>Trạng thái</Table.HeadCell>
					<Table.HeadCell>
						<span className='sr-only'>Edit</span>
					</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{editing ? (
						<EditableCategory
							key={editId}
							data={state.data.find((item) => item.id === editId)}
							editing={editing}
							editId={editId}
							handleCancelEdit={handleCancelEdit}
							handleEdit={handleEdit}
						/>
					) : (
						state.data.map((category, index) => (
							<EditableCategory
								key={category.id}
								data={category}
								editing={editing}
								editId={editId}
								handleCancelEdit={handleCancelEdit}
								handleEdit={handleEdit}
							/>
						))
					)}
				</Table.Body>
			</Table>
			{!editing && (
				<div className='flex justify-center gap-2'>
					{totalPage !== 1 && (
						<Pagination
							className='mt-0 pt-0'
							currentPage={pageNo}
							onPageChange={handlePageChange}
							previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
							nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
							totalPages={totalPage}
						/>
					)}
					<select
						name='perpage'
						onChange={(e) => {
							setPagesize(e.target.value);
						}}
						className='w-fit h-fit mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg'>
						<option defaultValue={'5'}>5</option>
						<option value={'10'}>10</option>
						<option value={'15'}>15</option>
					</select>
				</div>
			)}
		</>
	);
}
