import { Badge, Dropdown, Table } from 'flowbite-react';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import { ParseToDate } from './../../libs/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrash,
	faUserCheck,
	faChartLine,
	faMailBulk,
	faUserClock,
} from '@fortawesome/free-solid-svg-icons';

export default function TradingPartnerList({
	data,
	highlightText,
	offset,
	onDelete,
	onProcessed,
}) {
	const navigate = useNavigate();

	const handleDelete = (id) => {
		onDelete && onDelete(id);
	};

	const handleProcessed = (id) => {
		onProcessed && onProcessed(id);
	};

	return (
		<Table hoverable={true}>
			<Table.Head>
				<Table.HeadCell>#</Table.HeadCell>
				<Table.HeadCell>Tên đối tác</Table.HeadCell>
				<Table.HeadCell>Số điện thoại</Table.HeadCell>
				<Table.HeadCell>Email</Table.HeadCell>
				<Table.HeadCell>Ngày hợp tác</Table.HeadCell>
				<Table.HeadCell>Tùy chọn</Table.HeadCell>
			</Table.Head>
			<Table.Body className='divide-y'>
				{data.map((item, index) => (
					<Table.Row
						className=' bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
						key={item.id}>
						<Table.Cell>{index + offset + 1}</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							<Highlighter
								highlightClassName='bg-blue-300'
								searchWords={highlightText.split(' ')}
								autoEscape={true}
								textToHighlight={item.fullName}
							/>
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							{item.phoneNumber}
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							<Highlighter
								highlightClassName='bg-blue-300'
								searchWords={highlightText.split(' ')}
								autoEscape={true}
								textToHighlight={item.email}
							/>
						</Table.Cell>
						<Table.Cell className='font-medium flex flex-col gap-y-2 text-gray-900'>
							{!item.emailConfirmed && (
								<Badge color={'warning'}>
									<FontAwesomeIcon
										icon={faMailBulk}
										className='mr-2'
									/>
									Chưa xác nhận email
								</Badge>
							)}
							{item.dateAsPartner === null ? (
								<Badge color={'failure'}><FontAwesomeIcon
								icon={faUserClock}
								className='mr-2'
							/>Đang đợi duyệt</Badge>
							) : (
								<Badge color={'success'}>
									<FontAwesomeIcon
										icon={faUserCheck}
										className='mr-1'
									/>
									{ParseToDate(item.dateAsPartner)}
								</Badge>
							)}
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							<Dropdown label={'Tùy chọn'} color={'gray'} size={'xs'} placement='left'>
								{item.dateAsPartner === null && (
									<Dropdown.Item onClick={() => handleProcessed(item.id)}>
										<FontAwesomeIcon
											icon={faUserCheck}
											className='mr-2 text-green-500'
										/>
										Đánh dấu đã xử lí
									</Dropdown.Item>
								)}
								{item.dateAsPartner !== null && (
									<Dropdown.Item>
										<FontAwesomeIcon
											icon={faChartLine}
											className='mr-2 text-blue-600'
										/>
										Xem thống kê
									</Dropdown.Item>
								)}
								<Dropdown.Item onClick={() => handleDelete(item.id)}>
									<FontAwesomeIcon
										icon={faTrash}
										className='mr-2 text-red-600'
									/>
									Xóa đối tác
								</Dropdown.Item>
							</Dropdown>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
