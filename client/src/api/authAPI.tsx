import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  // TODO: make a POST request to the login route
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Login failed");
    }
  }
  catch (error) {
    console.error(error);
  }
}


export { login };