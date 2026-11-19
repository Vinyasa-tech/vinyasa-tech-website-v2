
import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAuth();

  const adminName = admin?.name || "Admin";
  const adminRole = admin?.role || "Administrator";

  const handleCloseSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handleLogout = useCallback(() => {
    setMobileOpen(false);
    logout();
  }, [logout]);

  return (
    <div className="flex h-dvh w-full min-w-0 max-w-full overflow-hidden bg-[#F5F6FC]">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={handleCloseSidebar}
        adminName={adminName}
        adminRole={adminRole}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex h-full w-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <div className="w-full min-w-0 shrink-0">
          <AdminHeader
            onMenuClick={handleOpenSidebar}
            onLogout={handleLogout}
            adminName={adminName}
            adminRole={adminRole}
          />
        </div>

        {/* PAGE CONTENT */}
        <main className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
          <div className="mx-auto min-h-full w-full min-w-0 max-w-[1920px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
