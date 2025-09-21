import { useState, useEffect } from "react";

function App() {
  // state to store current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect runs once after component loads
  useEffect(() => {
    // update time every 1 second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // cleanup function (stops timer when component is removed)
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>Welcome to Practical 3</h1>
      <h2>Current Date and Time:</h2>
      <p style={{ fontSize: "20px" }}>{currentTime.toLocaleString()}</p>
    </div>
  );
}

export default App;
