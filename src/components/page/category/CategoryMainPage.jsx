import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';
import { Link, Outlet } from 'react-router-dom';
import { faBars, faChartLine, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import NewCategoryModal from './NewCategoryModal';
import { useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { setOptionToNewest } from '../../../libs/store/categorySlice';

export default function CategoryMainPage(props) {
	const [showAddModal, setShowAddModal] = useState(false);
	const dispatch = useDispatch();

	const handleToggleAddModal = () => {
		setShowAddModal((prev) => !prev);
	};

	return (
		<Fragment>
			<NewCategoryModal show={showAddModal}
				handleOnClose={()=>{setShowAddModal(false)}}
				handleOnSuccess={() => {
					setShowAddModal(false);
					dispatch(setOptionToNewest());
				}}
			/>
			<div className='flex gap-2'>
				<Link to={'/category'}>
					<Button
						className='w-fit h-8 rounded-lg text-center'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách loại sản phẩm
					</Button>
				</Link>
				<Link to={'/category/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Button
					size={'xs'}
					gradientDuoTone={'cyanToBlue'}
					onClick={handleToggleAddModal}
					className='w-fit h-8 rounded-lg text-center'>
					<FontAwesomeIcon icon={faPlus} className='w-4 h-4 mr-1' />
					Thêm loại
				</Button>
				{/* <Button
					className='w-fit h-8 rounded-lg text-center'
					size={'xs'}
					gradientDuoTone={'cyanToBlue'}>
					<FontAwesomeIcon icon={faSearch} className='pr-2 w-4 h-4' />
					Tìm kiếm loại sản phẩm
				</Button> */}
				{/* <TextInput type={'search'} sizing={'sm'} placeholder={'Tìm kiếm loại sản phẩm'}/> */}
			</div>
			<Outlet />
		</Fragment>
	);
}
