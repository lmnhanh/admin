import Login from "./components/auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from './components/layout/Root';
import Dashboard from './components/page/Dashboard';
import NotFound404 from './components/page/NotFound404';
import Loader from './components/page/Loader';
import CategoryPage from './components/page/CategoryPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
		errorElement: <NotFound404/>,
		children:[
			{
				path: '/',
				element: <Dashboard/>
			},
			{
				path: '/login',
				element: <Login/>
			},
			{
				path: '/category',
				element: <CategoryPage/>
			}
		]
  },
]);
  
export default function App() {
	return (
		<RouterProvider router={router} />
	);
}
