import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../conf/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc,doc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";

import "./Login.css";
import flushLogo from "../../../assets/FlushLogo.png";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setFacility } = useUser(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userDocRef = doc(db, "User", user.uid);
      const userSnapshot = await getDoc(userDocRef);
  
      if (!userSnapshot.exists()) {
        setError("No user profile found in Firestore.");
        return;
      }
  
      const userData = userSnapshot.data();
      console.log("User Data:", userData);
  
      if (!userData.facilityId) {
        setError("No facility associated with this account.");
        return;
      }
  
      const facilityRef = doc(db, "Facility", userData.facilityId);
      const facilitySnapshot = await getDoc(facilityRef);
  
      if (!facilitySnapshot.exists()) {
        setError("The facility associated with this account does not exist.");
        return;
      }
  
      const facilityData = facilitySnapshot.data();
  
      setUser({ id: userDocRef.id, ...userData }); 
      setFacility({ facilityId: userData.facilityId, ...facilityData });
  
      if (userData.role === "admin" || userData.role === "management") {
        console.log("Navigating to /admin...");
        navigate("/admin");
      } else if (userData.role === "employee") {
        console.log("Navigating to /employee...");
        navigate("/employee/dashboard");
      } else {
        setError("Unauthorized role. Please contact the administrator.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to log in. Please try again.");
    }
  };
  
  

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const handleEmployeeSignup = () => {
    navigate("/employee-signup");
  };

  return (
    <main className="login-container" aria-label="Login Page">
      <section className="login-content">
        <img src={flushLogo} alt="Flush Logo" className="toilet-icon" />
        <h2 className="login-title">Facilities Management Portal</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="login-form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="login-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-required="true"
          />
  
          <label htmlFor="password" className="login-form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="login-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            aria-required="true"
          />
  
          {error && (
            <p className="error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}
  
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button className="create-account-button" onClick={handleCreateAccount}>
          Create Account
        </button>
        <button className="employee-signup-button" onClick={handleEmployeeSignup}>
          Employee Signup
        </button>
      </section>
    </main>
  );
};

export default Login;
