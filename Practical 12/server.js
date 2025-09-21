const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const validateNumber = (input) => {
  const trimmed = input.trim();

  if (trimmed === "") {
    return { valid: false, error: "Please enter a number!" };
  }

  const number = parseFloat(trimmed);

  if (isNaN(number)) {
    return { valid: false, error: "That's not a number! Please try again." };
  }

  if (number > 999999 || number < -999999) {
    return {
      valid: false,
      error: "That number is too big! Please use smaller numbers.",
    };
  }

  return { valid: true, value: number };
};

const performCalculation = (num1, num2, operation) => {
  switch (operation) {
    case "add":
      return {
        result: num1 + num2,
        symbol: "+",
        name: "Addition",
      };
    case "subtract":
      return {
        result: num1 - num2,
        symbol: "-",
        name: "Subtraction",
      };
    case "multiply":
      return {
        result: num1 * num2,
        symbol: "×",
        name: "Multiplication",
      };
    case "divide":
      if (num2 === 0) {
        return {
          error: "Oops! We can't divide by zero. Try a different number!",
        };
      }
      return {
        result: num1 / num2,
        symbol: "÷",
        name: "Division",
      };
    default:
      return {
        error: "Please choose an operation!",
      };
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "calculator.html"));
});

app.post("/calculate", (req, res) => {
  const { number1, number2, operation } = req.body;

  const validation1 = validateNumber(number1);
  const validation2 = validateNumber(number2);

  let errors = [];

  if (!validation1.valid) {
    errors.push(`First Number: ${validation1.error}`);
  }

  if (!validation2.valid) {
    errors.push(`Second Number: ${validation2.error}`);
  }

  if (!operation) {
    errors.push("Please choose what you want to do with the numbers!");
  }

  if (errors.length > 0) {
    return res.send(
      generateHTML({
        showResult: false,
        errors: errors,
        number1: number1 || "",
        number2: number2 || "",
        operation: operation || "",
      })
    );
  }

  const calculation = performCalculation(
    validation1.value,
    validation2.value,
    operation
  );

  if (calculation.error) {
    return res.send(
      generateHTML({
        showResult: false,
        errors: [calculation.error],
        number1: number1,
        number2: number2,
        operation: operation,
      })
    );
  }

  let displayResult = calculation.result;
  if (operation === "divide" && !Number.isInteger(calculation.result)) {
    displayResult = Math.round(calculation.result * 100) / 100;
  }

  res.send(
    generateHTML({
      showResult: true,
      result: {
        num1: validation1.value,
        num2: validation2.value,
        operation: calculation.name,
        symbol: calculation.symbol,
        answer: displayResult,
      },
      number1: number1,
      number2: number2,
      operation: operation,
    })
  );
});

function generateHTML(data) {
  const {
    showResult,
    errors = [],
    result,
    number1 = "",
    number2 = "",
    operation = "",
  } = data;

  let errorHTML = "";
  if (errors.length > 0) {
    errorHTML = `
      <div class="errors">
        <h3>🚨 Whoops! Let's fix these:</h3>
        <ul>
          ${errors.map((error) => `<li>${error}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  let resultHTML = "";
  if (showResult && result) {
    resultHTML = `
      <div class="result-section">
        <h3>🎉 Great job! Here's your answer:</h3>
        <div class="calculation-display">
          <span class="number">${result.num1}</span>
          <span class="symbol">${result.symbol}</span>
          <span class="number">${result.num2}</span>
          <span class="equals">=</span>
          <span class="answer">${result.answer}</span>
        </div>
        <p class="result-text">
          ${result.num1} ${result.symbol} ${result.num2} = <strong>${result.answer}</strong>
        </p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kids Calculator 🧮</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🧮 Kids Calculator 🌟</h1>
                <p>Let's do some fun math together!</p>
            </header>

            ${errorHTML}
            ${resultHTML}

            <form method="POST" action="/calculate" class="calculator-form">
                <div class="input-group">
                    <label for="number1">First Number:</label>
                    <input 
                        type="text" 
                        id="number1" 
                        name="number1" 
                        value="${number1}"
                        placeholder="Enter your first number"
                        class="number-input"
                    >
                </div>

                <div class="operation-group">
                    <label>What do you want to do?</label>
                    <div class="operation-buttons">
                        <label class="operation-option ${
                          operation === "add" ? "selected" : ""
                        }">
                            <input type="radio" name="operation" value="add" ${
                              operation === "add" ? "checked" : ""
                            }>
                            <span class="operation-btn add">➕ Add</span>
                        </label>
                        <label class="operation-option ${
                          operation === "subtract" ? "selected" : ""
                        }">
                            <input type="radio" name="operation" value="subtract" ${
                              operation === "subtract" ? "checked" : ""
                            }>
                            <span class="operation-btn subtract">➖ Subtract</span>
                        </label>
                        <label class="operation-option ${
                          operation === "multiply" ? "selected" : ""
                        }">
                            <input type="radio" name="operation" value="multiply" ${
                              operation === "multiply" ? "checked" : ""
                            }>
                            <span class="operation-btn multiply">✖️ Multiply</span>
                        </label>
                        <label class="operation-option ${
                          operation === "divide" ? "selected" : ""
                        }">
                            <input type="radio" name="operation" value="divide" ${
                              operation === "divide" ? "checked" : ""
                            }>
                            <span class="operation-btn divide">➗ Divide</span>
                        </label>
                    </div>
                </div>

                <div class="input-group">
                    <label for="number2">Second Number:</label>
                    <input 
                        type="text" 
                        id="number2" 
                        name="number2" 
                        value="${number2}"
                        placeholder="Enter your second number"
                        class="number-input"
                    >
                </div>

                <button type="submit" class="calculate-btn">
                    🚀 Calculate!
                </button>
            </form>

            <div class="try-again">
                <a href="/" class="new-calculation">🔄 Try Another Calculation</a>
            </div>

            <footer>
                <p>Keep practicing math - you're doing great! 🌈</p>
            </footer>
        </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`🧮 Kids Calculator running on http://localhost:${PORT}`);
  console.log("Ready for some fun math! 🌟");
});
