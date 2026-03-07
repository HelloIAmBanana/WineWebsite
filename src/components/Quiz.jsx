import { useState, useMemo, useCallback } from "react";
import wines from "../data/wines";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const questionTypes = [
  {
    id: "origin",
    label: "מוצא",
    question: (w) => `מאיפה מגיע ${w.name}?`,
    answer: (w) => w.origin,
    options: (w) =>
      wines
        .map((x) => x.origin)
        .filter((v, i, a) => a.indexOf(v) === i),
  },
  {
    id: "grapes",
    label: "זנים",
    question: (w) => `מאילו זנים מיוצר ${w.name}?`,
    answer: (w) => w.grapes,
    options: (w) =>
      wines
        .map((x) => x.grapes)
        .filter((v, i, a) => a.indexOf(v) === i),
  },
  {
    id: "style",
    label: "סגנון",
    question: (w) => `מהו הסגנון של ${w.name}?`,
    answer: (w) => w.style,
    options: (w) =>
      wines
        .map((x) => x.style)
        .filter((v, i, a) => a.indexOf(v) === i),
  },
  {
    id: "country",
    label: "ארץ",
    question: (w) => `מאיזו ארץ ${w.name}?`,
    answer: (w) => w.country,
    options: (w) =>
      wines
        .map((x) => x.country)
        .filter((v, i, a) => a.indexOf(v) === i),
  },
  {
    id: "body",
    label: "גוף",
    question: (w) => `מה גוף היין של ${w.name}?`,
    answer: (w) => w.body,
    options: (w) =>
      wines
        .map((x) => x.body)
        .filter((v, i, a) => a.indexOf(v) === i),
  },
  {
    id: "name_from_desc",
    label: "זיהוי יין",
    question: (w) => `איזה יין מתואר כך: "${w.salesPitch.slice(0, 80)}..."?`,
    answer: (w) => w.name,
    options: () => wines.map((x) => x.name),
  },
];

function generateQuestion() {
  const wine = wines[Math.floor(Math.random() * wines.length)];
  const qType =
    questionTypes[Math.floor(Math.random() * questionTypes.length)];

  const correctAnswer = qType.answer(wine);
  const allOptions = qType.options(wine).filter((o) => o !== correctAnswer);
  const wrongOptions = shuffleArray(allOptions).slice(0, 3);
  const options = shuffleArray([correctAnswer, ...wrongOptions]);

  return {
    question: qType.question(wine),
    correctAnswer,
    options,
    wine,
    type: qType.id,
  };
}

function generateQuiz(numQuestions = 10) {
  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    questions.push(generateQuestion());
  }
  return questions;
}

export default function Quiz() {
  const [mode, setMode] = useState("setup"); // setup, playing, results
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startQuiz = () => {
    setQuestions(generateQuiz(numQuestions));
    setCurrentQ(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setAnswers([]);
    setMode("playing");
  };

  const handleSelect = (option) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
    const isCorrect = option === questions[currentQ].correctAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQ].question,
        selected: option,
        correct: questions[currentQ].correctAnswer,
        isCorrect,
        wine: questions[currentQ].wine.name,
      },
    ]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setMode("results");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  if (mode === "setup") {
    return (
      <div className="quiz">
        <div className="quiz-setup">
          <h2>בחן/י את עצמך</h2>
          <p>בחר/י כמה שאלות</p>
          <div className="quiz-num-btns">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                className={`btn ${numQuestions === n ? "active" : ""}`}
                onClick={() => setNumQuestions(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button className="btn btn-start" onClick={startQuiz}>
            התחל מבחן
          </button>
        </div>
      </div>
    );
  }

  if (mode === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    let emoji, message;
    if (percentage === 100) {
      emoji = "🏆";
      message = "מושלם! את/ה מוכן/ה למבחן!";
    } else if (percentage >= 80) {
      emoji = "🌟";
      message = "כמעט מושלם! עוד קצת תרגול";
    } else if (percentage >= 60) {
      emoji = "💪";
      message = "לא רע! כדאי לחזור על החומר";
    } else {
      emoji = "📚";
      message = "צריך עוד תרגול - חזור/י לכרטיסיות!";
    }

    return (
      <div className="quiz">
        <div className="quiz-results">
          <div className="quiz-results-header">
            <span className="quiz-emoji">{emoji}</span>
            <h2>
              {score} / {questions.length}
            </h2>
            <div className="quiz-percentage">{percentage}%</div>
            <p>{message}</p>
          </div>
          <div className="quiz-results-list">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`quiz-result-item ${a.isCorrect ? "correct" : "wrong"}`}
              >
                <span className="quiz-result-icon">
                  {a.isCorrect ? "✓" : "✗"}
                </span>
                <div className="quiz-result-text">
                  <strong>{a.wine}</strong>
                  <p>{a.question}</p>
                  {!a.isCorrect && (
                    <p className="quiz-correct-answer">
                      תשובה נכונה: {a.correct}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-start" onClick={startQuiz}>
            נסה שוב
          </button>
          <button
            className="btn"
            onClick={() => setMode("setup")}
            style={{ marginTop: "0.5rem" }}
          >
            חזרה להגדרות
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${((currentQ + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        <span className="quiz-counter">
          שאלה {currentQ + 1} מתוך {questions.length}
        </span>
        <span className="quiz-score">
          ניקוד: {score}/{currentQ + (showAnswer ? 1 : 0)}
        </span>
      </div>

      <div className="quiz-question">
        <h3>{q.question}</h3>
      </div>

      <div className="quiz-options">
        {q.options.map((option, i) => {
          let className = "quiz-option";
          if (showAnswer) {
            if (option === q.correctAnswer) className += " correct";
            else if (option === selected) className += " wrong";
          } else if (option === selected) {
            className += " selected";
          }
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="quiz-feedback">
          <p className={selected === q.correctAnswer ? "correct" : "wrong"}>
            {selected === q.correctAnswer
              ? "✓ נכון!"
              : `✗ לא נכון. התשובה: ${q.correctAnswer}`}
          </p>
          <button className="btn btn-next" onClick={nextQuestion}>
            {currentQ + 1 >= questions.length ? "סיים מבחן" : "שאלה הבאה ←"}
          </button>
        </div>
      )}
    </div>
  );
}
