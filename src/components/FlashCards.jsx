import { useState, useCallback, useMemo } from "react";
import wines from "../data/wines";

const typeColors = {
  red: {
    bg: "rgba(139, 30, 63, 0.15)",
    border: "#8b1e3f",
    accent: "#c2185b"
  },
  white: {
    bg: "rgba(212, 175, 55, 0.12)",
    border: "#d4af37",
    accent: "#c8a82e",
  },
  sparkling: {
    bg: "rgba(212, 175, 55, 0.12)",
    border: "#d4af37",
    accent: "#c8a82e",
  },
  rose: {
    bg: "rgba(219, 112, 147, 0.15)",
    border: "#db7093",
    accent: "#e91e90",
  },
};

const typeLabels = {
  red: "אדום",
  white: "לבן",
  sparkling: "מבעבע",
  rose: "רוזה",
};

export default function FlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState("all");
  const [knownCards, setKnownCards] = useState(localStorage.getItem("knownCards") ? new Set(JSON.parse(localStorage.getItem("knownCards"))) : new Set());
  const [showKnown, setShowKnown] = useState(localStorage.getItem("showKnown") === "true");

  const filteredWines = useMemo(() => wines.filter((w) => {
    if (filter !== "all" && w.type !== filter) return false;
    if (!showKnown && knownCards.has(w.id)) return false;
    return true;
  }), [filter, knownCards, showKnown]);

  const wine = filteredWines[currentIndex] || filteredWines[0];
  const colors = wine ? typeColors[wine.type] : typeColors.red;

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % filteredWines.length);
    }, 150);
  }, [filteredWines.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) =>
        i === 0 ? filteredWines.length - 1 : i - 1
      );
    }, 150);
  }, [filteredWines.length]);

  const toggleKnown = (id) => {
    setKnownCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("knownCards", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const unknowAll = () => {
    setKnownCards(new Set());
    localStorage.removeItem("knownCards");
  }

  const shuffle = () => {
    setIsFlipped(false);
    // eslint-disable-next-line react-hooks/purity
    const newIndex = Math.floor(Math.random() * filteredWines.length);
    if (newIndex === currentIndex) {
      return shuffle();
    };
    setCurrentIndex(newIndex);
  };

  if (filteredWines.length === 0) {
    return (
      <div className="flashcards">
        <Filters
          filter={filter}
          setFilter={setFilter}
          setCurrentIndex={setCurrentIndex}
          setShowKnown={setShowKnown}
          showKnown={showKnown}
        />
        <div className="fc-empty">
          <p>כל הכבוד! כל הכרטיסים ידועים 🎉</p>
          <button className="btn" onClick={() => setShowKnown(true)}>
            הצג הכל
          </button>
          <button className="btn" onClick={unknowAll}>
            סמן הכל כלא ידוע
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcards">
      <Filters
        filter={filter}
        setFilter={setFilter}
        setCurrentIndex={setCurrentIndex}
        setShowKnown={setShowKnown}
        showKnown={showKnown}
      />

      <div className="fc-progress">
        <span>
          {currentIndex + 1} / {filteredWines.length}
        </span>
        <span className="fc-known-count">
          ידוע: {knownCards.size} / {wines.length}
        </span>
      </div>

      <div className="fc-card-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`fc-card ${isFlipped ? "flipped" : ""}`}>
          {/* Front - Wine name */}
          <div className="fc-face fc-front">
            <h2 className="fc-wine-name">{wine.name}</h2>
            <p className="fc-wine-name-en">{wine.nameEn}</p>
            <p className="fc-hint">לחץ/י כדי לגלות את הפרטים</p>
          </div>

          {/* Back - Details */}
          <div
            className="fc-face fc-back"
            style={{
              background: colors.bg,
              borderColor: colors.border,
            }}
          >
            <div className="fc-type-badge" style={{ background: colors.accent }}>
              {typeLabels[wine.type]}
            </div>
            <h3>{wine.name}</h3>
            <div className="fc-details">
              <div className="fc-detail-row">
                <span className="fc-label">מוצא:</span>
                <span>{wine.origin}</span>
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">סגנון:</span>
                <span>{wine.style}</span>
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">זנים:</span>
                <span>{wine.grapes}</span>
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">גוף:</span>
                <span>{wine.body}</span>
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">ארומות:</span>
                <span>{wine.aromas.join(", ")}</span>
              </div>
              {wine.specialNote && (
                <div className="fc-detail-row fc-special">
                  <span className="fc-label">מיוחד:</span>
                  <span>{wine.specialNote}</span>
                </div>
              )}
              <div className="fc-sales-pitch">
                <span className="fc-label">משפט מכירה:</span>
                <p>{wine.salesPitch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fc-controls">
        <button className="btn btn-nav" onClick={goPrev}>
          → הקודם
        </button>
        <button
          className={`btn btn-know ${knownCards.has(wine.id) ? "known" : "unknown"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleKnown(wine.id);
          }}
        >
          {knownCards.has(wine.id) ? "✓ ידוע" : "✗ לא ידוע"}
        </button>
        <button className="btn btn-shuffle" onClick={shuffle}>
          רנדומלי 🎲
        </button>
        <button className="btn btn-nav" onClick={goNext}>
          הבא ←
        </button>
      </div>
    </div>
  );
}

function Filters({ filter, setFilter, showKnown, setShowKnown, setCurrentIndex }) {
  const filters = [
    { key: "all", label: "הכל" },
    { key: "red", label: "אדום" },
    { key: "white", label: "לבן" },
    { key: "sparkling", label: "מבעבע" },
    { key: "rose", label: "רוזה" },
  ];
  return (
    <div className="fc-filters">
      <div className="fc-filter-btns">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`btn btn-filter ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="fc-toggle">
        <input
          type="checkbox"
          checked={showKnown}
          onChange={(e) => {
            setShowKnown(e.target.checked);
            localStorage.setItem("showKnown", `${e.target.checked}`);
            setCurrentIndex(0);
          }}
        />
        הצג כרטיסים ידועים
      </label>
    </div>
  );
}
