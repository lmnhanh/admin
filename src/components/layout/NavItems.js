import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTags } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../page/Dashboard';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Login from './../auth/Login';
import CategoryPage from './../page/CategoryPage';

const NavItems = [
  {
    title: 'Dashboard',
    icon: ()=> <FontAwesomeIcon icon={faHome}/>,
    href: '/'
  },
  {
    title: 'Loại sản phẩm',
    icon: ()=> <FontAwesomeIcon icon={faTags}/>,
    href: '/category'
  },
  {
    title: 'Login',
    icon: ()=> <FontAwesomeIcon icon={faRightToBracket}/>,
    href: '/login'
  },
]
export default NavItems;