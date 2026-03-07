import { useState } from "react";
import FlashCards from "./components/FlashCards";
import Quiz from "./components/Quiz";
import WineTable from "./components/WineTable";
import MatchGame from "./components/MatchGame";
import "./App.css";

const tabs = [
  { id: "flashcards", label: "כרטיסיות", icon: "🃏" },
  { id: "quiz", label: "מבחן", icon: "📝" },
  { id: "match", label: "התאמה", icon: "🔗" },
  { id: "table", label: "סקירה", icon: "📋" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("flashcards");

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <span className="header-icon">🍷</span>
            Wine Study
            <span className="header-subtitle">לימוד יינות למבחן</span>
          </h1>
        </div>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === "flashcards" && <FlashCards />}
        {activeTab === "quiz" && <Quiz />}
        {activeTab === "match" && <MatchGame />}
        {activeTab === "table" && <WineTable />}
      </main>

      <footer className="app-footer">
        <p>בהצלחה במבחן! 🍷</p>
      </footer>
    </div>
  );
}
