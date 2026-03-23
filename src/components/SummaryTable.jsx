import { useState } from "react";
import items from "../data/items";

const typeLabels = {
  red: "🍷 אדום",
  white: "🥂 לבן",
  sparkling: "✨ מבעבע",
  rose: "🌹 רוזה",
  term: "🧠 מושג"
};

export default function SummaryTable() {
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) => {
    if (activeFilter !== "all" && item.type !== activeFilter) return false;
    if (
      searchTerm &&
      !item.name.includes(searchTerm) &&
      !item.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.origin?.includes(searchTerm) &&
      !item.grapes?.includes(searchTerm)
    )
      return false;
    return true;
  });

  const expandAll = () => {
    if (expandedId === -1) {
      setExpandedId(null);
    } else {
      setExpandedId(-1);
    }
  }

  return (
    <div className="summary-table">
      <div className="st-controls">
        <input
          className="st-search"
          type="text"
          placeholder="חיפוש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="st-filters">
          {[
            { key: "all", label: "הכל" },
            { key: "red", label: "אדום" },
            { key: "white", label: "לבן" },
            { key: "sparkling", label: "מבעבע" },
            { key: "rose", label: "רוזה" },
            { key: "term", label: "מושג" },
          ].map((filter) => (
            <button
              key={filter.key}
              className={`btn btn-filter ${activeFilter === filter.key ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
          <button
            className={`btn btn-filter ${expandedId === -1 ? "active" : ""}`}
            onClick={expandAll}
          >
            ⛶
          </button>
        </div>
      </div>

      <div className="st-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`st-card st-card-${item.type} ${expandedId === item.id ? "expanded" : ""}`}
            onClick={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          >
            <div className="st-card-header">
              <span className="st-type">{typeLabels[item.type]}</span>
              <h3>{item.name}</h3>
              <span className="st-name-en">{item.nameEn}</span>
            </div>
            {item.type === "term"
              ? (
                <div className="st-card-body">
                  <div className="st-pitch">
                    <p>{item.description}</p>
                  </div>
                </div>
              )
              : (
                <div className="st-card-body">
                  <div className="st-info-grid">
                    <div className="st-info">
                      <span className="st-label">מוצא</span>
                      <span>{item.origin}</span>
                    </div>
                    <div className="st-info">
                      <span className="st-label">זנים</span>
                      <span>{item.grapes}</span>
                    </div>
                    <div className="st-info">
                      <span className="st-label">סגנון</span>
                      <span>{item.style}</span>
                    </div>
                    <div className="st-info">
                      <span className="st-label">גוף</span>
                      <span>{item.body}</span>
                    </div>
                  </div>
                  {(expandedId === item.id || expandedId === -1) && (
                    <div className="st-expanded">
                      <div className="st-aromas">
                        <span className="st-label">ארומות:</span>
                        <div className="st-aroma-tags">
                          {item.aromas.map((a, i) => (
                            <span key={i} className="st-aroma-tag">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      {item.specialNote && (
                        <div className="st-special">
                          <span className="st-label">הערה מיוחדת:</span>
                          <span>{item.specialNote}</span>
                        </div>
                      )}
                      <div className="st-pitch">
                        <span className="st-label">משפט מכירה:</span>
                        <p>{item.salesPitch}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
