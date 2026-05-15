import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

import "../../styles/Auth.css";

export default function Auth() {
  const [tab, setTab] = useState("login");

  const navigate = useNavigate();

  return (
    <div className="auth">

      {/* CLOSE BUTTON */}
      <button
        className="auth__close"
        onClick={() => navigate("/")}
      >
        ✕
      </button>

      <div className="auth__card">

        {/* TITLE */}
        <h2 className="auth__title">
          {tab === "login"
            ? "Welcome Back"
            : "Create Account"}
        </h2>

        {/* TABS */}
        <div className="auth__tabs">

          <button
            className={
              tab === "login"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("login")
            }
          >
            Login
          </button>

          <button
            className={
              tab === "register"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("register")
            }
          >
            Register
          </button>

        </div>

        {/* CONTENT */}
        <div className="auth__content">
          {tab === "login"
            ? <Login />
            : <Register />}
        </div>

        {/* FOOTER */}
        <p className="auth__footer">

          {tab === "login" ? (
            <>
              Don’t have an account?{" "}

              <span
                onClick={() =>
                  setTab("register")
                }
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}

              <span
                onClick={() =>
                  setTab("login")
                }
              >
                Login
              </span>
            </>
          )}

        </p>

      </div>

    </div>
  );
}