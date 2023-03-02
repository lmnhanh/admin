import { Link } from "react-router-dom";
import { Button } from 'flowbite-react';

export default function NotFound404(props) {
  return(
    <div className="text-center">
      401 - UNAUTHORIZED
      <Link to={'/login'}><Button size={'xs'} gradientMonochrome={'info'}>Đăng nhập lại</Button></Link>
    </div>
  )
}