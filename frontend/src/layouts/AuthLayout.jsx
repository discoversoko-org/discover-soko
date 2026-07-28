// src/layouts/AuthLayout.jsx

import { Outlet } from "react-router-dom";

import "../styles/layout.css";

export default function AuthLayout() {
  return (
    <main className="page">
      <section className="page-content">
        <Outlet />
      </section>
    </main>
  );
}