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
import ProductInfoPage from './components/page/product/ProductInfoPage';
import NewProductDetail from './components/page/product/detail/NewProductDetail';
import VenderMainPage from './components/page/vender/VenderMainPage';
import VenderListPage from './components/page/vender/VenderListPage';
import VenderInfoPage from './components/page/vender/VenderInfoPage';
import InvoiceMainPage from './components/page/invoice/InvoiceMainPage';
import InvoiceListPage from './components/page/invoice/InvoiceListPage';
import InvoiceInfoPage from './components/page/invoice/InvoiceInfoPage';
import NewInvoicePage from './components/page/invoice/NewInvoicePage';
import StockMainPage from './components/page/stock/StockMainPage';

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
						path: '/product/:id',
						element: <ProductInfoPage />,
					},
					{
						path: '/product/new',
						element: <NewProductPage />,
					},
					{
						path: '/product/overall',
						element: <CategoryOverallPage />,
					},
					{
						path: '/product/:id/detail',
						element: <NewProductDetail/>
					}
				],
			},
			{
				path: '/vender',
				element: <VenderMainPage />,
				children: [
					{
						path: '/vender',
						element: <VenderListPage />,
					},
					{
						path: '/vender/:id',
						element: <VenderInfoPage />,
					},
					{
						path: '/vender/new',
						element: <NewProductPage />,
					},
					{
						path: '/vender/overall',
						element: <CategoryOverallPage />,
					}
				],
			},
			{
				path: '/invoice',
				element: <InvoiceMainPage />,
				children: [
					{
						path: '/invoice',
						element: <InvoiceListPage />,
					},
					{
						path: '/invoice/:id',
						element: <InvoiceInfoPage />,
					},
					{
						path: '/invoice/new',
						element: <NewInvoicePage />,
					},
					{
						path: '/invoice/overall',
						element: <CategoryOverallPage />,
					}
				],
			},
			{
				path: '/stock',
				element: <StockMainPage />
			}
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/notfound',
		element: <NotFound404 />,
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
