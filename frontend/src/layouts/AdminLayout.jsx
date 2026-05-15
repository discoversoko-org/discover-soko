import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-content">
        <Sidebar userType="admin" />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}