import {
	faCheck,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Table } from 'flowbite-react';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import { ParseToDate } from '../../libs/helper';

export default function CategoryList({ data, highlightText }) {
	const navigate = useNavigate();

	return (
		<Table hoverable={true}>
			<Table.Head>
				<Table.HeadCell>#</Table.HeadCell>
				<Table.HeadCell>Tên loại</Table.HeadCell>
				<Table.HeadCell>Trạng thái</Table.HeadCell>
				<Table.HeadCell>Ngày cập nhật</Table.HeadCell>
			</Table.Head>
			<Table.Body className='divide-y'>
				{data.map((item, index) => (
					<Table.Row className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100' key={item.id} onClick={()=>{
						navigate(`/category/edit/${item.id}`);
					}}>
						<Table.Cell>{item.id}</Table.Cell>
						<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
							<Highlighter
								highlightClassName='bg-blue-300'
								searchWords={highlightText.split(' ')}
								autoEscape={true}
								textToHighlight={item.name}
							/>
						</Table.Cell>
						<Table.Cell>
							{item.isActive ? (
								<Badge className='w-fit' color={'success'}>
									<FontAwesomeIcon icon={faCheck} className='mr-1' />
									Đang kinh doanh
								</Badge>
							) : (
								<Badge color={'dark'} className='w-fit'>
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
										to={`/category/edit/${item.id}`}
										className='w-full hover:text-blue-600'>
										<FontAwesomeIcon
											className='pr-1 w-4 h-4 text-blue-500'
											icon={faPenToSquare}
										/>
										Chỉnh sửa
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
	);
}
