import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function UserLayout() {
  return (
    <div className="user-layout">
      
      <div className="user-content">
        <Sidebar userType="user" />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}