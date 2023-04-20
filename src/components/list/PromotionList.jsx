import { Badge, Table } from 'flowbite-react';
import React, { Fragment } from 'react';
import Highlighter from 'react-highlight-words';
import { FormatCurrency, ParseToDate } from '../../libs/helper';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCancel,
	faCheck,
	faClockFour,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function PromotionList({ data, offset, highlightText }) {
	const navigate = useNavigate();

	return (
		<Fragment>
			<Table hoverable={true}>
				<Table.Head>
					<Table.HeadCell>#</Table.HeadCell>
					<Table.HeadCell>Tên khuyến mãi</Table.HeadCell>
					<Table.HeadCell>Ngày tạo</Table.HeadCell>
					<Table.HeadCell>Giá trị khuyến mãi</Table.HeadCell>
					<Table.HeadCell>Trạng thái</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{data.map((item, index) => (
						<Table.Row
							className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
							key={index}
							onClick={() => navigate(`/promotion/${item.id}`)}>
							<Table.Cell>{index + offset + 1}</Table.Cell>
							<Table.Cell className='items-center whitespace-nowrap font-medium text-gray-900'>
								<Highlighter
									highlightClassName='bg-blue-300'
									searchWords={highlightText.split(' ')}
									autoEscape={true}
									textToHighlight={item.name}
								/>
							</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{ParseToDate(item.dateCreate)}
							</Table.Cell>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
								{item.isPercentage ? (
									<Badge color={'info'} className={'w-fit'}>
										{item.discount} % tối đa {FormatCurrency(item.maxDiscount)}
									</Badge>
								) : (
									<Badge color={'info'} className={'w-fit'}>
										{FormatCurrency(item.discount)}
									</Badge>
								)}
							</Table.Cell>
							<Table.Cell className='flex gap-1'>
								{!item.isActive && (
									<Badge color={'gray'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faCancel} className={'mr-1'} />
										Không khả dụng
									</Badge>
								)}
								{new Date(item.dateStart) <= new Date() &&
									new Date(item.dateEnd) >= new Date() && (
										<Badge color={'success'} className={'w-fit min-w-fit'}>
											<FontAwesomeIcon icon={faCheck} className={'mr-1'} />
											Đang áp dụng
										</Badge>
									)}

								{new Date(item.dateStart) > new Date() && (
									<Badge color={'info'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faClockFour} className={'mr-1'} />
										Sắp áp dụng
									</Badge>
								)}
								{new Date(item.dateEnd) < new Date() && (
									<Badge color={'failure'} className={'w-fit min-w-fit'}>
										<FontAwesomeIcon icon={faXmark} className={'mr-1'} />
										Ngưng áp dụng
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
