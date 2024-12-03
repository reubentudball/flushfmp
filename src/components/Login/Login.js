import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../conf/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "../context/UserContext";
import "./Login.css";
import flushLogo from "../../assets/FlushLogo.png";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setFacility } = useUser(); 

  const handleLogin = async () => {
    setError("");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const facilityQuery = query(
        collection(db, "Facility"),
        where("adminIds", "array-contains", user.uid)
      );
      const facilitySnapshot = await getDocs(facilityQuery);
  
      if (facilitySnapshot.empty) {
        setError("No facility associated with this account.");
        return;
      }
  
      const facilityDoc = facilitySnapshot.docs[0];
      const facilityData = facilityDoc.data();
  
      const userQuery = query(collection(db, "User"), where("uid", "==", user.uid));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        setError("No user profile found in Firestore.");
        return;
      }
  
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
  
      setUser({
        ...userData,
      });
  
      setFacility({
        facilityId: facilityDoc.id,
        ...facilityData,
      });
  
      console.log("Navigating to /admin...");
      navigate("/admin");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to log in. Please try again.");
    }
  };
  

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src={flushLogo} alt="Flush Logo" className="toilet-icon" />
        <h2>Facilities Management Portal</h2>
        <form>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <p className="error">{error}</p>}

          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
        <button className="create-account-button" onClick={handleCreateAccount}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
