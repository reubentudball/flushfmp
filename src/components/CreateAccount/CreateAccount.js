import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../conf/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateDoc, query, where, collection, getDocs, setDoc, doc } from "firebase/firestore";
import "./CreateAccount.css";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [facilityKey, setFacilityKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    setError("");
    setSuccess("");

    try {
      const facilityQuery = query(
        collection(db, "Facility"),
        where("facilityKey", "==", facilityKey)
      );
      const querySnapshot = await getDocs(facilityQuery);

      if (querySnapshot.empty) {
        setError("Invalid Facility Key. Please check and try again.");
        return;
      }

      const facilityDoc = querySnapshot.docs[0];
      const facilityRef = facilityDoc.ref;
      const facilityData = facilityDoc.data();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateDoc(facilityRef, {
        adminIds: [...facilityData.adminIds, user.uid],
      });

      const userDocRef = doc(db, "User", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        role: "management",
        facilityId: facilityDoc.id,
        createdAt: new Date().toISOString(),
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      console.error("Error creating account:", err);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-content">
        <h2>Create Admin Account</h2>
        <form>
          <div className="inline-fields">
            <div className="input-group">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="input-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <label>Facility Key:</label>
          <input
            type="text"
            value={facilityKey}
            onChange={(e) => setFacilityKey(e.target.value)}
            placeholder="Enter your facility key"
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="button" onClick={handleCreateAccount}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
