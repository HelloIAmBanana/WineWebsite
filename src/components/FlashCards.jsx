import { useState, useCallback, useMemo } from "react";
import items from "../data/items";

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
  term: {
    bg: "rgba(33, 150, 243, 0.12)",
    border: "#2196f3",
    accent: "#1976d2",
  },
};

const typeLabels = {
  red: "אדום",
  white: "לבן",
  sparkling: "מבעבע",
  rose: "רוזה",
  term: "מושג"
};

export default function FlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState("all");
  const [knownCards, setKnownCards] = useState(localStorage.getItem("knownCards") ? new Set(JSON.parse(localStorage.getItem("knownCards"))) : new Set());
  const [showKnown, setShowKnown] = useState(true);
  const [wineOnly, setWineOnly] = useState(false);
  const [termsOnly, setTermsOnly] = useState(false);

  const filteredItems = useMemo(() => items.filter((item) => {
    if (termsOnly && item.type !== "term") return false;
    if (wineOnly && item.type == "term") return false;
    if (filter !== "all" && item.type !== filter) return false;
    if (!showKnown && knownCards.has(item.id)) return false;
    return true;
  }), [filter, knownCards, showKnown, wineOnly, termsOnly]);

  const item = filteredItems[currentIndex] || filteredItems[0];
  const colors = item ? typeColors[item.type] : typeColors.red;

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % filteredItems.length);
    }, 150);
  }, [filteredItems.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) =>
        i === 0 ? filteredItems.length - 1 : i - 1
      );
    }, 150);
  }, [filteredItems.length]);

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
    localStorage.setItem("knownCards", JSON.stringify([]));
  }

  const shuffle = () => {
    setIsFlipped(false);
    // eslint-disable-next-line react-hooks/purity
    const newIndex = Math.floor(Math.random() * filteredItems.length);
    if (newIndex === currentIndex) {
      return shuffle();
    };
    setCurrentIndex(newIndex);
  };

  const showAll = () => {
    setShowKnown(true);
    setFilter("all");
    setWineOnly(false);
    setTermsOnly(false);
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flashcards">
        <Filters
          filter={filter}
          setFilter={setFilter}
          setCurrentIndex={setCurrentIndex}
          setShowKnown={setShowKnown}
          showKnown={showKnown}
          wineOnly={wineOnly}
          setWineOnly={setWineOnly}
          setTermsOnly={setTermsOnly}
          termsOnly={termsOnly}
        />
        <div className="fc-empty">
          <p>כל הכבוד! כל הכרטיסים נגמרו 🎉</p>
          <button className="btn" onClick={showAll}>
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
        wineOnly={wineOnly}
        setWineOnly={setWineOnly}
        setTermsOnly={setTermsOnly}
        termsOnly={termsOnly}
      />
      <div className="fc-progress">
        <span>
          {currentIndex + 1} / {filteredItems.length}
        </span>
        <span className="fc-known-count">
          ידוע: {knownCards.size} / {items.length}
        </span>
      </div>
      <div className="fc-card-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`fc-card ${isFlipped ? "flipped" : ""}`}>
          {/* Front - Wine name */}
          <div className="fc-face fc-front">
            <h2 className="fc-item-name">{item.name}</h2>
            <p className="fc-item-name-en">{item.nameEn}</p>
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
              {typeLabels[item.type]}
            </div>
            <h3>{item.name}</h3>
            {item.type === "term"
              ? (
                <div className="fc-details">
                  <div className="fc-sales-pitch">
                    <p>{item.description}</p>
                  </div>
                </div>
              )
              : (
                <div className="fc-details">
                  <div className="fc-detail-row">
                    <span className="fc-label">מוצא:</span>
                    <span>{item.origin}</span>
                  </div>
                  <div className="fc-detail-row">
                    <span className="fc-label">סגנון:</span>
                    <span>{item.style}</span>
                  </div>
                  <div className="fc-detail-row">
                    <span className="fc-label">זנים:</span>
                    <span>{item.grapes}</span>
                  </div>
                  <div className="fc-detail-row">
                    <span className="fc-label">גוף:</span>
                    <span>{item.body}</span>
                  </div>
                  <div className="fc-detail-row">
                    <span className="fc-label">ארומות:</span>
                    <span>{item.aromas.join(", ")}</span>
                  </div>
                  {item.specialNote.length > 0 && (
                    <div className="fc-detail-row fc-special">
                      <span className="fc-label">מיוחד:</span>
                      <span>{item.specialNote}</span>
                    </div>
                  )}
                  <div className="fc-sales-pitch">
                    <span className="fc-label">משפט מכירה:</span>
                    <p>{item.salesPitch}</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="fc-controls">
        <button className="btn btn-nav" onClick={goPrev}>
          → הקודם
        </button>
        <button
          className={`btn btn-know ${knownCards.has(item.id) ? "known" : "unknown"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleKnown(item.id);
          }}
        >
          {knownCards.has(item.id) ? "✓ ידוע" : "✗ לא ידוע"}
        </button>
        <button className="btn btn-shuffle" onClick={shuffle}>
          רנדומלי 🎲
        </button>
        <button className="btn btn-nav" onClick={goNext}>
          הבא ←
        </button>
      </div>
    </div >
  );
}

function Filters({
  filter,
  setFilter,
  showKnown,
  setShowKnown,
  setCurrentIndex,
  wineOnly,
  setWineOnly,
  termsOnly,
  setTermsOnly
}) {
  const filters = [
    { key: "all", label: "הכל" },
    { key: "red", label: "אדום" },
    { key: "white", label: "לבן" },
    { key: "sparkling", label: "מבעבע" },
    { key: "rose", label: "רוזה" },
    { key: "term", label: "מושג" },
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
        הצג כרטיסים ידועים
        <input
          type="checkbox"
          checked={showKnown}
          onChange={(e) => {
            setShowKnown(e.target.checked);
            setCurrentIndex(0);
          }}
        />
      </label>
      <label className="fc-toggle">
        הצג רק יינות
        <input
          type="checkbox"
          checked={wineOnly}
          onChange={(e) => {
            setWineOnly(e.target.checked);
            setCurrentIndex(0);
          }}
        />
      </label>
      <label className="fc-toggle">
        הצג רק מושגים
        <input
          type="checkbox"
          checked={termsOnly}
          onChange={(e) => {
            setTermsOnly(e.target.checked);
            setCurrentIndex(0);
          }}
        />
      </label>
    </div>
  );
}
