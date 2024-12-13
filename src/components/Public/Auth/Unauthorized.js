import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go to Login</Link>
    </div>
  );
};

export default Unauthorized;
