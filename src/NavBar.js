import React from "react";

const NavBar = ({ onLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        background: "#f8f8f8",
        width: "100%", // Full width
        position: "fixed", // Fixed position
        top: 0,
        left: 0,
        zIndex: 1000, // Ensure it sits above other content
      }}
    >
      <img
        src="/path/to/logo.png"
        alt="Company Logo"
        style={{ height: "50px" }}
      />
      <button onClick={onLogout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </div>
  );
};

export default NavBar;
