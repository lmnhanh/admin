import {Table } from 'flowbite-react';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';

export default function VenderList({ data, highlightText, offset }) {
	const navigate = useNavigate();

	return (
		<Table hoverable={true} className={''}>
			<Table.Head>
				<Table.HeadCell>#</Table.HeadCell>
				<Table.HeadCell>Tên nhà cung cấp</Table.HeadCell>
				<Table.HeadCell>Số điện thoại</Table.HeadCell>
				<Table.HeadCell>Email</Table.HeadCell>
				<Table.HeadCell>Doanh nghiệp</Table.HeadCell>
			</Table.Head>
			<Table.Body className='divide-y'>
				{data.map((item, index) => (
					<Table.Row
						className=' bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
						key={item.id}
						onClick={() => navigate(`/vender/${item.id}`)}>
						<Table.Cell>{index + offset + 1}</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							<Highlighter
								highlightClassName='bg-blue-300'
								searchWords={highlightText.split(' ')}
								autoEscape={true}
								textToHighlight={item.name}
							/>
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							{item.phoneNumber}
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							{item.email}
						</Table.Cell>
						<Table.Cell className='font-medium text-gray-900'>
							{item.company}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
