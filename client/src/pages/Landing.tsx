import auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to board
    if (auth.loggedIn()) {
      navigate("/board");
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      <h1>Login to create & view tickets</h1>
    </div>
  );
};

export default Landing;