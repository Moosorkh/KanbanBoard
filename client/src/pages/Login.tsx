// pages/Login.tsx

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import auth from "../utils/auth";
import { login } from "../api/authAPI";

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.loggedIn()) {
      console.log("User already logged in, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [loginData, setLoginData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (auth.loggedIn()) {
    navigate("/");
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.username.trim() || !loginData.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await login(loginData);
      auth.login(data.token);
      // Redirect to the page the user was trying to access
      const origin = location.state?.from?.pathname || "/";
      navigate(origin, { replace: true });
     // navigate("/board");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("404")) {
          setError("User not found");
        } else if (err.message.includes("401")) {
          setError("Invalid password");
        } else {
          setError("Login failed. Please try again");
        }
      }
      console.error("Failed to login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your username"
          autoComplete="username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={isLoading || !loginData.username || !loginData.password}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
