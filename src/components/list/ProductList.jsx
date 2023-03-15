import { faCheck, faStar, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Table } from 'flowbite-react';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import { ParseToDate } from '../../libs/helper';

export default function ProductList({ data, highlightText }) {
	const navigate = useNavigate();

	return (
		<Table hoverable={true}>
			<Table.Head>
				<Table.HeadCell>#</Table.HeadCell>
				<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
				<Table.HeadCell>Loại</Table.HeadCell>
				<Table.HeadCell>Trạng thái</Table.HeadCell>
				<Table.HeadCell>Ngày cập nhật</Table.HeadCell>
				{/* <Table.HeadCell>
					<span className='sr-only'>Options</span>
				</Table.HeadCell> */}
			</Table.Head>
			<Table.Body className='divide-y'>
				{data.map((item, index) => (
					<Table.Row
						className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
						key={item.id}
						onClick={() => navigate(`/product/${item.id}`)}>
						<Table.Cell>{item.id}</Table.Cell>
						<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
							<Highlighter
								highlightClassName='bg-blue-300'
								searchWords={highlightText.split(' ')}
								autoEscape={true}
								textToHighlight={item.name}
							/>
							
							{item.isRecommended && (
									<FontAwesomeIcon icon={faStar} className='text-yellow-300 ml-1' />
							)}
						</Table.Cell>
						<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
							{item.category.name}
						</Table.Cell>
						<Table.Cell>
							{item.isActive ? (
								<Badge className='w-fit' color={'success'}>
									<FontAwesomeIcon icon={faCheck} className='mr-1' />
									Đang kinh doanh
								</Badge>
							) : (
								<Badge color={'dark'}>
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
	);
}
