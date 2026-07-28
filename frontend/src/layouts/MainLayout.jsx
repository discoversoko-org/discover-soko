// src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";

import "../styles/navigation/MainLayout.css";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}