import { faInfo, faPencil, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
	Badge,
	Button,
	Table,
	TextInput,
	Dropdown,
	Checkbox,
	Label,
} from 'flowbite-react';
import { useFormik } from 'formik';
import { Form } from 'react-router-dom';

export default function EditableCategory(props) {
	const { data, editing, editId, handleEdit, handleCancelEdit } = props;

	const formik = useFormik({
		initialValues: {
			id: data.id,
			name: data.name,
			isActive: data.isActive,
		},
		onSubmit: async (values) => {
			const resopnse = axios({
				url: `https://localhost:7028/api/categories/${values.id}`,
				method: 'put',
				data: values
			});
			const {status} = await resopnse;
			status === 204 && handleCancelEdit()
		},
	});

	return (
		<Table.Row className='bg-white mx-1' key={data.id}>
			<Table.Cell>{data.id}</Table.Cell>
			<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
				{editing ? (
					<TextInput
						name='name'
						autoFocus
						color={'gray'}
						sizing={'sm'}
						onChange={formik.handleChange}
						value={formik.values.name}
					/>
				) : (
					data.name
				)}
			</Table.Cell>
			<Table.Cell>
				{editing ? (
					<>
						<Checkbox
							className='mx-2'
							name='isActive'
							id='isActive'
							checked={formik.values.isActive}
							onChange={formik.handleChange}
						/>
						<Label htmlFor='isActive' className='cursor-pointer'>
							Đang kinh doanh
						</Label>
					</>
				) : formik.values.isActive ? (
					<Badge className='w-fit' color={'info'}>
						Đang kinh doanh
					</Badge>
				) : (
					<Badge color={'dark'}>Ngừng kinh doanh</Badge>
				)}
			</Table.Cell>
			<Table.Cell>
				{editing ? (
					<div className='flex gap-1'>
						<Button size={'xs'} onClick={formik.handleSubmit}>
							Lưu
						</Button>
						<Button size={'xs'} color={'failure'} onClick={handleCancelEdit}>
							Hủy
						</Button>
					</div>
				) : (
					<Dropdown label='Tùy chọn' color={'gray'} size={'xs'}>
						<Dropdown.Item
							onClick={() => handleEdit(data.id)}
							icon={() => (
								<FontAwesomeIcon className='px-2' icon={faPenToSquare} />
							)}>
							Chỉnh sửa
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item icon={() => <FontAwesomeIcon icon={faInfo} />}>
							Thông tin
						</Dropdown.Item>
					</Dropdown>
				)}
			</Table.Cell>
		</Table.Row>
	);
}
