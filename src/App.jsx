import { useEffect, useState } from "react";
import "./App.css";
import questions from "./questions";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  // TIMER
  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
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

  // RESULT
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

          <div className="timer">⏱️ {formatTime()}</div>
        </div>

        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h2 className="question">{question.question}</h2>

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

              <span className="option-text">{option}</span>
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
            <button type="button" onClick={nextQuestion}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;