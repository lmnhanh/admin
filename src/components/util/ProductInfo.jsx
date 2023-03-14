import FilterBadge from './FilterBadge';
import React from 'react';
import { Link } from 'react-router-dom';
import { faCheck, faXmark, faStar } from '@fortawesome/free-solid-svg-icons';

export default function ProductInfo({ product }) {
	return (
		<React.Fragment>
			<div className='flex gap-2'>
				{product.isActive ? (
					<FilterBadge
						label='Đang kinh doanh'
						icon={faCheck}
						color={'success'}
					/>
				) : (
					<FilterBadge
						label='Đã ngừng kinh doanh'
						icon={faXmark}
						color={'failure'}
					/>
				)}
				{product.isRecommended && (
					<FilterBadge
						label='Sản phẩm được đề xuất'
						icon={faStar}
						color={'warning'}
					/>
				)}
			</div>
			<div className='font-semibold'>
				Sản phẩm: <span className='mr-3 text-md font-bold'>{product.name}</span>
			</div>
			<div className='flex'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
					<div className='flex gap-2'>
						<div className='font-semibold'>Mã sản phẩm:</div>
						<div className=''>{product.wellKnownId}</div>
					</div>
					<div className='flex gap-2 cursor-pointer'>
						<div className='font-semibold'>Loại sản phẩm:</div>
						<Link
							to={`/category/edit/${product.category.id}`}
							className='text-blue-500'>
							{product.category.name}
						</Link>
					</div>
					<div className='flex flex-col lg:col-span-2 gap-2'>
						<div className='font-semibold'>Mô tả:</div>
						<div className='text-ellipsis'
							dangerouslySetInnerHTML={{
								__html: product.description,
							}}></div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
