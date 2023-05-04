import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../../util/Loader";
import ProductCard from "./ProductCard";

export default function HotProduct() {
  const [products, setProducts] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			const { data, status } = await axios.get(
				`/api/products?page=${1}&size=${12}`
			);
			if (status === 200) {
				setProducts(data.products);
			}
		};
		fetchProducts();
	}, []);
  
  return products !== null ? (
		<main className="flex flex-col my-2 gap-2">
			<div className="border-b uppercase font-semibold text-slate-600">Sản phẩm đề xuất</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
				{products.map((product, index) =>
						product.details.filter((detail) => detail.isAvailable).length !== 0 &&
             <ProductCard product={product} key={index} />
				)}
			</div>
		</main>
	) : (
		<Loader />
	);
}