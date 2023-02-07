import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, Table, TextInput, Button } from 'flowbite-react';
import Loader from '../page/Loader';
import { Link } from 'react-router-dom';
import DetailModal from '../EditableModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditableInput from '../EditableInput';

export default function CategoryList(props) {
	const [state, setState] = useState({
		data: [],
		loading: true,
	});

	const [editData, setEditdata] = useState({});
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const response = await axios.get('https://localhost:7028/api/categories');
		const { data, status } = response;
		status == '200' &&
			setState({
				data: data,
				loading: false,
			});
	};

	const handleEdit = (category) => {
		setEditdata(category);
		setEditing(true);
	};
	const handleCancelEdit = () => {
		setEditdata({});
		setEditing(false);
	};

	return state.loading ? (
		<Loader />
	) : (
		<>
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
					{state.data.map((category, index) =>
						editData.id == category.id ? (
							<Table.Row className='bg-white mx-1' key={category.id}>
								<Table.Cell>{category.id}</Table.Cell>
								<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
									<EditableInput
										data={category}
										editing={editData.id == category.id}
									/>
								</Table.Cell>
								<Table.Cell>
									{category.isActive ? (
										<Badge className='w-fit' color={'info'}>
											Đang kinh doanh
										</Badge>
									) : (
										<Badge color={'dark'}>Ngừng kinh doanh</Badge>
									)}
								</Table.Cell>
								<Table.Cell>
									<Button size={'xs'} onClick={() => handleCancelEdit()}>
										Lưu
									</Button>
								</Table.Cell>
							</Table.Row>
						) : ( !editing &&
							<Table.Row className='bg-white mx-1' key={category.id}>
								<Table.Cell>{category.id}</Table.Cell>
								<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
									<EditableInput
										data={category}
										editing={editData.id == category.id}
									/>
								</Table.Cell>
								<Table.Cell>
									{category.isActive ? (
										<Badge className='w-fit' color={'info'}>
											Đang kinh doanh
										</Badge>
									) : (
										<Badge color={'dark'}>Ngừng kinh doanh</Badge>
									)}
								</Table.Cell>
								<Table.Cell>
									<Dropdown
										label='Tùy chọn'
										color={'gray'}
										size={'xs'}>
										<Dropdown.Item
											onClick={() => {
												handleEdit(category);
											}}
											icon={() => (
												<FontAwesomeIcon
													className='px-2'
													icon={faPenToSquare}
												/>
											)}>
											Chỉnh sửa
										</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item
											icon={() => <FontAwesomeIcon icon={faPencil} />}>
											Sign out
										</Dropdown.Item>
									</Dropdown>
								</Table.Cell>
							</Table.Row>
						)
					)}
				</Table.Body>
			</Table>
		</>
	);
}
