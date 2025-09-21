import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const reset = () => {
    setCount(0);
  };

  const incrementFive = () => {
    setCount((prevCount) => prevCount + 5);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="counter-section">
          <h1 className="count-display">Count: {count}</h1>

          <div className="button-group">
            <button className="btn btn-reset" onClick={reset}>
              Reset
            </button>
            <button className="btn btn-increment" onClick={increment}>
              Increment
            </button>
            <button className="btn btn-decrement" onClick={decrement}>
              Decrement
            </button>
            <button className="btn btn-increment-five" onClick={incrementFive}>
              Increment 5
            </button>
          </div>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to CHARUSAT!!!</h2>

          <div className="input-section">
            <div className="input-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                placeholder="Enter first name"
                className="text-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                placeholder="Enter last name"
                className="text-input"
              />
            </div>
          </div>

          <div className="display-section">
            <div className="display-text">
              <span className="label">First Name:</span>
              <span className="value">{firstName}</span>
            </div>

            <div className="display-text">
              <span className="label">Last Name:</span>
              <span className="value">{lastName}</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <p>
            Department of Computer Science and Engineering, CSPIT & DEPSTAR,
            CHARUSAT
          </p>
          <p>Full Stack Development</p>
        </div>
      </div>
    </div>
  );
}

export default App;
