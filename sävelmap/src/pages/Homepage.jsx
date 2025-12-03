import React from "react";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="homepage">
      <h1>Tervetuloa Sävelmappiin!</h1>
      <p>Löydät sovelluksen linkistä alla.</p>
      <Link to="/app">Sävelmap</Link>
    </div>
  );
}

export default Homepage;