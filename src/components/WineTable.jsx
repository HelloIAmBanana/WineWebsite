import { useState } from "react";
import wines from "../data/wines";

const typeLabels = {
  red: "🍷 אדום",
  white: "🥂 לבן",
  sparkling: "✨ מבעבע",
  rose: "🌹 רוזה",
};

export default function WineTable() {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = wines.filter((w) => {
    if (filter !== "all" && w.type !== filter) return false;
    if (
      searchTerm &&
      !w.name.includes(searchTerm) &&
      !w.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !w.origin.includes(searchTerm) &&
      !w.grapes.includes(searchTerm)
    )
      return false;
    return true;
  });

  return (
    <div className="wine-table">
      <div className="wt-controls">
        <input
          className="wt-search"
          type="text"
          placeholder="חפש יין..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="wt-filters">
          {[
            { key: "all", label: "הכל" },
            { key: "red", label: "אדום" },
            { key: "white", label: "לבן" },
            { key: "sparkling", label: "מבעבע" },
            { key: "rose", label: "רוזה" },
          ].map((f) => (
            <button
              key={f.key}
              className={`btn btn-filter ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wt-grid">
        {filtered.map((wine) => (
          <div
            key={wine.id}
            className={`wt-card wt-card-${wine.type} ${expandedId === wine.id ? "expanded" : ""}`}
            onClick={() =>
              setExpandedId(expandedId === wine.id ? null : wine.id)
            }
          >
            <div className="wt-card-header">
              <span className="wt-type">{typeLabels[wine.type]}</span>
              <h3>{wine.name}</h3>
              <span className="wt-name-en">{wine.nameEn}</span>
            </div>
            <div className="wt-card-body">
              <div className="wt-info-grid">
                <div className="wt-info">
                  <span className="wt-label">מוצא</span>
                  <span>{wine.origin}</span>
                </div>
                <div className="wt-info">
                  <span className="wt-label">זנים</span>
                  <span>{wine.grapes}</span>
                </div>
                <div className="wt-info">
                  <span className="wt-label">סגנון</span>
                  <span>{wine.style}</span>
                </div>
                <div className="wt-info">
                  <span className="wt-label">גוף</span>
                  <span>{wine.body}</span>
                </div>
              </div>
              {expandedId === wine.id && (
                <div className="wt-expanded">
                  <div className="wt-aromas">
                    <span className="wt-label">ארומות:</span>
                    <div className="wt-aroma-tags">
                      {wine.aromas.map((a, i) => (
                        <span key={i} className="wt-aroma-tag">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  {wine.specialNote && (
                    <div className="wt-special">
                      <span className="wt-label">הערה מיוחדת:</span>
                      <span>{wine.specialNote}</span>
                    </div>
                  )}
                  <div className="wt-pitch">
                    <span className="wt-label">משפט מכירה:</span>
                    <p>{wine.salesPitch}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
