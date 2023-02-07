import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, Table } from 'flowbite-react';
import Loader from '../page/Loader';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditableModal from '../EditableModal';
import {faPencil,faPenSquare,faPenToSquare} from '@fortawesome/free-solid-svg-icons';

export default function CategoryListModal(props) {
	const [state, setState] = useState({
		data: [],
		loading: true,
	});

	const [modalState, setModalState] = useState({
		data: {},
		showing: false,
	});

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

	const handelOpenModal = (category) => {
		setModalState({
			data: category,
			showing: true,
		});
	};

	return state.loading ? (
		<Loader />
	) : (
		<>
			<EditableModal title={'Thông tin'} state={modalState} setState = {setModalState} />
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
					{state.data.map((category, index) => (
						<Table.Row className='bg-white' key={category.id}>
							<Table.Cell>{category.id}</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{category.name}
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
								<Dropdown label='Tùy chọn' color={'info'} size={'xs'}>
									<Dropdown.Item
										color='info'
										onClick={() => handelOpenModal(category)}
										icon={() => (
											<FontAwesomeIcon className='px-1' icon={faPenToSquare} />
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
					))}
				</Table.Body>
			</Table>
		</>
	);
}
