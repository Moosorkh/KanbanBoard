// client/src/components/Navbar.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../utils/auth";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and token changes
    const checkAuthStatus = () => {
      setIsAuthenticated(auth.loggedIn());
    };

    checkAuthStatus();

    // Add event listener for storage changes (in case of logout in another tab)
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="nav-title">
        <Link to="/">Krazy Kanban Board</Link>
      </div>
      <ul>
        {!isAuthenticated ? (
          <li className="nav-item">
            <button type="button">
              <Link to="/login">Login</Link>
            </button>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/create" className="nav-link">
                Create Ticket
              </Link>
            </li>
            <li className="nav-item">
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
