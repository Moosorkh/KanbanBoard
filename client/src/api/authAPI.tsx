import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  // TODO: make a POST request to the login route
  try {
    // Make a POST request to the server with the user info to login at /auth/login
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      // Read error message
      const errorMessage = await response.text();
      throw new Error(`Login failed: ${errorMessage}`);
    }

    // Get the JSON data
    const data = await response.json();

    // Check if token exists in the response
    if (data.token) {
      // Store the token in localStorage
      localStorage.setItem("token", data.token);
      return data; // return the data if needed
    } else {
      throw new Error("Token missing in response");
    }
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

export { login };