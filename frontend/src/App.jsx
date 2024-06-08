import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup";
import Signin from "./page/Signin";
import Dashboard from "./page/Dashboard";
import {SendMoney} from "./page/SendMoney";
// import {NavbarWithMegaMenu} from "./components/Navbar";




function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
                    {/* <Route path="/try" element={<NavbarWithMegaMenu />} /> */}

        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App
