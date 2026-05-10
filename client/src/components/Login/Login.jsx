import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

const Login = ({ setCurrentUser, setShowLogin, users, setUsers }) => {
  const [signState, setSignState] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const normalizeUser = (backendUser) => ({
    id: backendUser.id,
    username: backendUser.username,
    email: backendUser.email,
    profileImage: backendUser.profileImage || null,
    comments: backendUser.comments || [],
    hand_warmers_placed: backendUser.hand_warmers_placed || []
  });


  const syncUserState = (backendUser) => {
    const normalized = normalizeUser(backendUser);

    setCurrentUser(normalized);

    setUsers(prev => {
      const exists = prev.some(u => Number(u.id) === Number(normalized.id));
      if (!exists) return [...prev, normalized];

      return prev.map(u =>
        Number(u.id) === Number(normalized.id) ? normalized : u
      );
    });

    setShowLogin(false);
  };


  const backendSignup = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/auth/signup",
        { username, email, password },
        { withCredentials: true }
      );


      localStorage.setItem("token", res.data.token);

      return res.data.user;
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
      return null;
    }
  };


  const backendLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // ⭐ Save JWT token
      localStorage.setItem("token", res.data.token);

      return res.data.user;
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      return null;
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    const backendUser = await backendSignup();
    if (backendUser) syncUserState(backendUser);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const backendUser = await backendLogin();
    if (backendUser) syncUserState(backendUser);
  };


  return (
    <div className="signState-container">
      <div onClick={() => setShowLogin(false)} className="cross">X</div>

      <h1>{signState === "login" ? "Log In" : "Sign Up"}</h1>

      <form onSubmit={signState === "signup" ? handleSignup : handleLogin}>
        
        {signState === "signup" && (
          <input
            required
            className="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          required
          className="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          className="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="account-exist">
          {signState === "login" ? (
            <div>
              Don't have an account?{" "}
              <span onClick={() => setSignState("signup")}>Click here</span>
            </div>
          ) : (
            <div>
              Already have an account?{" "}
              <span onClick={() => setSignState("login")}>Click here</span>
            </div>
          )}
        </div>

        <button className="submit" type="submit">
          {signState === "login" ? "Log In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
