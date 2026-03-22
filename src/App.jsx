import { useState } from "react";
import { FlashCards, SummaryTable } from "./components";
import "./App.css";

const tabs = [
  { id: "flashcards", label: "כרטיסיות", icon: "🃏" },
  { id: "table", label: "סיכום", icon: "📋" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("flashcards");

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <div className="header-content">
          <h1>
            מבחן יין לנונו
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
        {activeTab === "table" && <SummaryTable />}
      </main>

      <footer className="app-footer">
        <p>נוצר מתוך שעמום על ידי אושרי דגן ♥</p>
      </footer>
    </div>
  );
}
