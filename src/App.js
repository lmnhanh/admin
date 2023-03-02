import Login from './components/auth/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/layout/Root';
import Dashboard from './components/page/Dashboard';
import NotFound404 from './components/util/NotFound404';
import CategoryListPage from './components/page/category/CategoryListPage';
import CategoryMainPage from './components/page/category/CategoryMainPage';
import CategoryEditPage from './components/page/category/CategoryEditPage';
import CategoryOverallPage from './components/page/category/CategoryOverallPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProductMainPage from './components/page/product/ProductMainPage';
import ProductListPage from './components/page/product/ProductListPage';
import NewProductPage from './components/page/product/NewProductPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Root />
			</ProtectedRoute>
		),
		errorElement: <NotFound404 />,
		children: [
			{
				path: '/',
				element: <Dashboard />,
			},
			{
				path: '/category',
				element: <CategoryMainPage />,
				children: [
					{
						path: '/category',
						element: <CategoryListPage />,
					},
					{
						path: '/category/edit/:id',
						element: <CategoryEditPage />,
					},
					{
						path: '/category/overall',
						element: <CategoryOverallPage />,
					},
				],
			},
			{
				path: '/product',
				element: <ProductMainPage />,
				children: [
					{
						path: '/product',
						element: <ProductListPage />,
					},
					{
						path: '/product/edit/:id',
						element: <CategoryEditPage />,
					},
					{
						path: '/product/new',
						element: <NewProductPage />,
					},
					{
						path: '/product/overall',
						element: <CategoryOverallPage />,
					},
				],
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
