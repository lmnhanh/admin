import { Badge, Table } from 'flowbite-react';
import React, { Fragment } from 'react';
import Highlighter from 'react-highlight-words';
import { FormatCurrency, ParseToDate } from '../../libs/helper';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faCheckDouble,
	faClock,
	faDollar,
	faMoneyCheck,
	faUserCheck,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import FilterBadge from '../util/FilterBadge';

export default function OrderList({ data, offset, highlightText }) {
	const navigate = useNavigate();

	return (
		<Fragment>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>#</Table.HeadCell>
					<Table.HeadCell>Ngày tạo</Table.HeadCell>
					<Table.HeadCell>Khách hàng</Table.HeadCell>
					<Table.HeadCell>Tổng giá trị</Table.HeadCell>
					<Table.HeadCell>Trạng thái</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{data.map((item, index) => (
						<Table.Row
							className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
							key={index}
							onClick={() => navigate(`/order/${item.id}`)}>
							<Table.Cell>{index + offset + 1}</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{ParseToDate(item.dateCreate)}
							</Table.Cell>
							<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
								<Highlighter
									highlightClassName='bg-blue-300'
									searchWords={highlightText.split(' ')}
									autoEscape={true}
									textToHighlight={item.user?.fullName ?? 'Khách vãng lai'}
								/>
							</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								<Badge color={'info'} className={'w-fit'}>{FormatCurrency(item.total)}</Badge>
							</Table.Cell>
							<Table.Cell>
								{!item.isProccesed && !item.isSuccess && (
									<Badge color={'warning'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faClock} className={'mr-1'} />
										Đang chờ xử lí
									</Badge>
								)}
								{item.isProccesed && !item.isSuccess && (
									<Badge color={'info'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faUserCheck} className={'mr-1'} />
										Đã xử lí
									</Badge>
								)}

								{item.isSuccess && item.isProccesed && (
									<Badge color={'success'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faCheck} className={'mr-1'} />
										Thành công
									</Badge>
								)}
								{!item.isProccesed && item.isSuccess && (
									<Badge color={'failure'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faXmark} className={'mr-1'} />
										Thất bại
									</Badge>
								)}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</Fragment>
	);
}
