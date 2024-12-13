import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../conf/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getEmployeeByEmail, copyEmployeeData } from "../../Repo/employeeRepository";
import "./EmployeeSignup.css";

const EmployeeSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleEmailCheck = async () => {
    setError("");
    setSuccess("");

    try {
      const employee = await getEmployeeByEmail(email);
      if (!employee) {
        setError("Email not found in the system. Please contact your admin.");
        return;
      }
      setStep(2);
    } catch (err) {
      console.error("Email Check Error:", err);
      setError("Failed to validate email. Please try again.");
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const employee = await getEmployeeByEmail(email);
      await copyEmployeeData(employee.id, uid);

      setSuccess("Account created successfully! You can now log in.");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2>Employee Signup</h2>
        {step === 1 && (
          <form>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {error && <p className="error">{error}</p>}
            <button type="button" onClick={handleEmailCheck}>
              Next
            </button>
          </form>
        )}
        {step === 2 && (
          <form>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
            />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="button" onClick={handleSignup}>
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmployeeSignup;
