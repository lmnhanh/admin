import { useSelector, useDispatch } from 'react-redux';
import { Navbar } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { setAuthorized, toggleSidebar} from '../../libs/store/slices';

export default function Header(props) {
	const { name } = useSelector((state) => {
		return { name: state.app.name };
	});

	const dispatch = useDispatch();

	return(
		<Navbar fluid={true} rounded={true} className={'w-full'}>
			<div className='flex items-center'>
				<FontAwesomeIcon
					icon={faBars}
					className='mr-6 h-6 w-6 cursor-pointer'
					onClick={() => {
						dispatch(toggleSidebar());
					}}
				/>
				<Link to={'/'} className='text-xl font-bold cursor-pointer'>
					AB Seafood
				</Link>
			</div>
			<div className='flex md:order-2'>
				{name ? (
					<Button
						gradientMonochrome={'info'}
						size={'sm'}
						onClick={() => {
							// dispatch(updateUsername(undefined));
							// dispatch(setToken(''))
							dispatch(setAuthorized({authorized :false}))
						}}>
						{name}
					</Button>
				) : (
					<Link to={'/login'}>
						<Button gradientMonochrome={'info'} size={'sm'}>
							Đăng nhập
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link href='/navbars'>About</Navbar.Link>
				<Navbar.Link href='/navbars'>Contact</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}
