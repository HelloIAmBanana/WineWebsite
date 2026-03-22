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

export default function GarageInfo() {
  const colors = typeColors.rose;

  return (
    <div className="flashcards">
      <div className="fc-card-wrapper" >
        <div className={`fc-card flipped}`}>
          {/* Front - Wine name */}
          <div className="fc-face fc-front">
            <h2 className="fc-item-name">גראז' דה פאפא</h2>
          </div>

          {/* Back - Details */}
          <div
            className="fc-face fc-back"
            style={{
              background: colors.bg,
              borderColor: colors.border,
            }}
          >
            {/* <div className="fc-type-badge" style={{ background: colors.accent }}>
              {/* {typeLabels[item.type]} */}

            <h3>גראז' דה פאפא</h3>
            <div className="fc-details">
              <div className="fc-sales-pitch">
                <p>כמו שאנו מייצרים ומכינים את הפסטות, הגלידות והקינוחים בעצמנו אנו מוכרים גם יין מהיקב המשפחתי!</p>
                <p>לעידו, יקב בוטיק שם מייצר את יין הגראז' דה פאפא (גראז' = חניה מקורה של בית פרטי) (דה פאפא = של אבא). השם נובע מהעובדה שהיקב הוקם והיה שנים בחניה של הבית המשפחתי בהוד השרון בשיתוף של עידו ואביו.</p>
                <p>עידו בעברו היה היינן הראשי של יקב רקנאטי, כיום עידו הוא היינן הראשי של "ברקן סגל" ונחשב לאחד הייננים הטובים בארץ ולא מזמן קיבל את התואר היוקרתי והמשמעותי ביותר בעולם היין "Master of Wine”</p>
                <p>עידו הינו MW השני בישראל ואחד מ-409 מאסטרים (MW) מרחבי העולם ומתוכם כאמור כ- 100 ייננים.</p>
                <p>ישנם שלושה יינות גראז' הנמכרים במסעדה: גראז' לבן (מענבי שרדונה), גראז' אדום (מענבי פטיט סירה וסירה) וגראז ’אשכולות שלמים (מענבי סירה) יינות אלו זכו לתארים ושבחים רבים בעולם היין.</p>
              </div>
            </div>
            {/* )
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
              )} */}
          </div>
        </div>
      </div>
    </div >
  );
}