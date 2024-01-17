import React from "react";

const Header = () => {
  return (
    <div style={headerStyle}>
      <h1 style={headingStyle}>Drone Detection</h1>
      <p style={subTextStyle}>Upload an image to identify drones</p>
    </div>
  );
};

// Styles
const headerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px",
  textAlign: "center",
};

const headingStyle = {
  fontSize: "2em",
  margin: "0",
};

const subTextStyle = {
  fontSize: "1.2em",
  margin: "0",
};

export default Header;
