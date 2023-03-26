import { Table } from 'flowbite-react';
import React, { Fragment } from 'react';
import Highlighter from 'react-highlight-words';
import { FormatCurrency, ParseToDate } from '../../libs/helper';
import { useNavigate } from 'react-router-dom';

export default function InvoiceList({ data, offset }) {
	const navigate = useNavigate();

	return (
		<Fragment>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>#</Table.HeadCell>
					<Table.HeadCell>Ngày tạo</Table.HeadCell>
					<Table.HeadCell>Nhà cung cấp</Table.HeadCell>
					<Table.HeadCell>Tổng giá trị</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{data.map((item, index) => (
						<Table.Row
							className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
							key={index}
							onClick={() => navigate(`/invoice/${item.id}`)}>
							<Table.Cell>{index + offset + 1}</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{ParseToDate(item.dateCreate)}
							</Table.Cell>
							<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
								{item.vender.name}
							</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{FormatCurrency(item.realTotal)}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</Fragment>
	);
}
