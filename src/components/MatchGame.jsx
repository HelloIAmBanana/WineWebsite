import { useState, useMemo } from "react";
import wines from "../data/wines";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const matchModes = [
  { id: "origin", label: "יין ← מוצא", getRight: (w) => w.origin },
  { id: "grapes", label: "יין ← זנים", getRight: (w) => w.grapes },
  { id: "body", label: "יין ← גוף", getRight: (w) => w.body },
];

export default function MatchGame() {
  const [mode, setMode] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [moves, setMoves] = useState(0);

  const startGame = (m) => {
    setMode(m);
    const selected = shuffleArray(wines).slice(0, 6);
    setPairs(selected);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrongPair(null);
    setMoves(0);
  };

  const rightItems = useMemo(() => {
    if (!mode || !pairs.length) return [];
    const modeConfig = matchModes.find((m) => m.id === mode);
    return shuffleArray(pairs.map((w) => ({ id: w.id, text: modeConfig.getRight(w) })));
  }, [mode, pairs]);

  const handleLeftClick = (id) => {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    setWrongPair(null);
    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id) => {
    if (matched.has(id)) return;
    setSelectedRight(id);
    setWrongPair(null);
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId, rightId) => {
    setMoves((m) => m + 1);
    if (leftId === rightId) {
      setMatched((prev) => new Set([...prev, leftId]));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  };

  if (!mode) {
    return (
      <div className="match-game">
        <div className="match-setup">
          <h2>משחק התאמה</h2>
          <p>חבר/י בין יינות לפרטים שלהם</p>
          <div className="match-modes">
            {matchModes.map((m) => (
              <button
                key={m.id}
                className="btn btn-mode"
                onClick={() => startGame(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isDone = matched.size === pairs.length;

  return (
    <div className="match-game">
      <div className="match-header">
        <button className="btn" onClick={() => setMode(null)}>
          ← חזרה
        </button>
        <span className="match-moves">צעדים: {moves}</span>
        <span className="match-progress">
          {matched.size}/{pairs.length}
        </span>
      </div>

      {isDone ? (
        <div className="match-done">
          <h2>🎉 סיימת!</h2>
          <p>
            ב-{moves} צעדים
          </p>
          <button className="btn btn-start" onClick={() => startGame(mode)}>
            שחק שוב
          </button>
          <button className="btn" onClick={() => setMode(null)}>
            בחר מצב אחר
          </button>
        </div>
      ) : (
        <div className="match-board">
          <div className="match-column">
            <h4>יין</h4>
            {pairs.map((w) => (
              <button
                key={w.id}
                className={`match-item ${matched.has(w.id) ? "matched" : ""} ${selectedLeft === w.id ? "selected" : ""} ${wrongPair?.left === w.id ? "wrong" : ""}`}
                onClick={() => handleLeftClick(w.id)}
                disabled={matched.has(w.id)}
              >
                {w.name}
              </button>
            ))}
          </div>
          <div className="match-column">
            <h4>{matchModes.find((m) => m.id === mode)?.label.split("←")[1]}</h4>
            {rightItems.map((item) => (
              <button
                key={item.id}
                className={`match-item ${matched.has(item.id) ? "matched" : ""} ${selectedRight === item.id ? "selected" : ""} ${wrongPair?.right === item.id ? "wrong" : ""}`}
                onClick={() => handleRightClick(item.id)}
                disabled={matched.has(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
