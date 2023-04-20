import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

export default function ShopMainPage() {
  return(
    <main>
      <NavBar/>
      <Outlet/>
      <div>footer</div>
    </main>
  )
}