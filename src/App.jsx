import { useEffect, useState } from "react";
import "./App.css";
import questions from "./questions";

function App() {
  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  // TIMER
  useEffect(() => {
    if (!started || submitted) return;

    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const startTest = () => {
    if (studentName.trim() === "") {
      alert("Please enter your name");
      return;
    }

    setStarted(true);
  };

  const question = questions[currentQuestion];

  const selectAnswer = (index) => {
    setSelectedAnswer(index);

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: index,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;

      setCurrentQuestion(next);
      setSelectedAnswer(answers[next] ?? null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      const previous = currentQuestion - 1;

      setCurrentQuestion(previous);
      setSelectedAnswer(answers[previous] ?? null);
    }
  };

  const submitTest = () => {
    setSubmitted(true);
  };

  // NAME SCREEN
  if (!started) {
    return (
      <div className="app">
        <div className="test-card">
          <div className="header">
            <h1>Online Test</h1>
          </div>

          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <h2>Student Details</h2>

            <p style={{ marginBottom: "20px" }}>
              Please enter your name to start the test.
            </p>

            <input
              type="text"
              placeholder="Enter Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "14px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <br />

            <button
              type="button"
              onClick={startTest}
              style={{
                padding: "12px 30px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Start Test →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULT PAGE
  if (submitted) {
    const correct = questions.filter(
      (q, index) => answers[index] === q.answer
    ).length;

    const attempted = Object.keys(answers).length;
    const wrong = attempted - correct;
    const unattempted = questions.length - attempted;
    const percentage = ((correct / questions.length) * 100).toFixed(2);

    return (
      <div className="app">
        <div className="result-card">
          <h1>Test Result</h1>

          <div className="result-item">
            <span>Student Name</span>
            <strong>{studentName}</strong>
          </div>

          <div className="result-item">
            <span>Total Questions</span>
            <strong>{questions.length}</strong>
          </div>

          <div className="result-item correct">
            <span>Correct</span>
            <strong>{correct}</strong>
          </div>

          <div className="result-item wrong">
            <span>Wrong</span>
            <strong>{wrong}</strong>
          </div>

          <div className="result-item">
            <span>Unattempted</span>
            <strong>{unattempted}</strong>
          </div>

          <div className="score">
            <h2>
              {correct} / {questions.length}
            </h2>

            <p>{percentage}%</p>
          </div>

          {/* ANSWER REVIEW */}
          <div className="answer-review">
            <h2>Answer Review</h2>

            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isUnattempted = userAnswer === undefined;
              const isCorrect = userAnswer === q.answer;

              return (
                <div
                  key={index}
                  className={`review-card ${
                    isUnattempted
                      ? "unattempted"
                      : isCorrect
                      ? "correct-answer"
                      : "wrong-answer"
                  }`}
                >
                  <h3>
                    Question {index + 1}: {q.question}
                  </h3>

                  {isUnattempted ? (
                    <>
                      <p>
                        <strong>Your Answer:</strong> Not Attempted
                      </p>

                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.options[q.answer]}
                      </p>

                      <div className="status">
                        🟡 Not Attempted
                      </div>
                    </>
                  ) : isCorrect ? (
                    <>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        {q.options[userAnswer]}
                      </p>

                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.options[q.answer]}
                      </p>

                      <div className="status">
                        🟢 Correct
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        {q.options[userAnswer]}
                      </p>

                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.options[q.answer]}
                      </p>

                      <div className="status">
                        🔴 Wrong
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={() => window.location.reload()}>
            Take Test Again
          </button>
        </div>
      </div>
    );
  }

  // TEST PAGE
  return (
    <div className="app">
      <div className="test-card">
        <div className="header">
          <h1>Online Test</h1>

          <div className="timer">
            ⏱️ {formatTime()}
          </div>
        </div>

        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h2 className="question">
          {question.question}
        </h2>

        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`option ${
                selectedAnswer === index ? "selected" : ""
              }`}
              onClick={() => selectAnswer(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>

              <span className="option-text">
                {option}
              </span>
            </button>
          ))}
        </div>

        <div className="navigation">
          <button
            type="button"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              type="button"
              className="submit"
              onClick={submitTest}
            >
              Submit Test ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;