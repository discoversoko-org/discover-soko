// src/pages/auth/Splash.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logos/logo.svg";

import { ROUTES } from "../../constants/routes";

import "../../styles/auth/splash.css";

const SPLASH_DURATION = 6000;

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.WELCOME, { replace: true });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash">
      <img
        src={Logo}
        alt="Soko"
        className="splash-logo"
      />
    </main>
  );
}