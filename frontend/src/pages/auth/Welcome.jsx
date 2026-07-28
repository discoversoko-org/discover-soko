import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";

import { ROUTES } from "../../constants/routes";

import welcomeImage from "../../assets/images/welcome.svg";

import "../../styles/auth/welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("splashRefresh", "1");
  }, []);

  return (
    <main className="welcome-page">

      {/* Top Section */}
      <div className="welcome-image">
        <img
          src={welcomeImage}
          alt="Welcome"
        />
      </div>

      {/* Bottom Section */}
      <div className="welcome-bottom">
        <h1>Welcome to Soko</h1>

        <AuthButton
          text="Get Started"
          onClick={() =>
            navigate(ROUTES.REGISTER_EMAIL)
          }
        />
      </div>

    </main>
  );
}