import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <h1>全栈应用</h1>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/query"
                className={location.pathname === "/query" ? "active" : ""}
              >
                查询页面
              </Link>
              <span>欢迎, {user?.username}</span>
              <button onClick={logout} className="btn btn-secondary">
                退出登录
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
