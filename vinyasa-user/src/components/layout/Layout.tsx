import { Outlet } from "react-router-dom";

import TopContactBar from "@/components/layout/TopContactBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Layout() {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-clip bg-white">
      <TopContactBar />

      <Navbar />

      <main className="min-w-0 w-full flex-1 overflow-x-clip">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;