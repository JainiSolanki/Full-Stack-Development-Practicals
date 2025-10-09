import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // Load from localStorage when app starts
  useEffect(() => {
    const savedCount = localStorage.getItem("repCount");
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
  }, []);

  // Save to localStorage whenever count changes
  useEffect(() => {
    localStorage.setItem("repCount", count);
  }, [count]);

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count > 0 ? count - 1 : 0);
  const reset = () => setCount(0);

  return (
    <div className="counter-container">
      <h1>Rep Counter</h1>
      <div className="count">{count}</div>
      <div className="buttons">
        <button className="decrease" onClick={decrease}>-</button>
        <button className="increase" onClick={increase}>+</button>
      </div>
      <button className="reset" onClick={reset}>Reset</button>
    </div>
  );
}

export default App;
