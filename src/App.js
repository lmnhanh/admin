import Login from "./components/auth/Login";
import { Layout } from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

export default function App() {
	return (
		<Layout>
			<Routes>
				<Route index={true} element={<Dashboard />} />;
				<Route exact path="/login" element={<Login />} />;
				<Route path="*" element={<Login />} />
			</Routes>
		</Layout>
	);
}
