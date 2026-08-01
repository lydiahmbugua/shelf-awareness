import { useMemo, useState } from "react";
import "./App.css";

const goalTypes = [
  { id: "books", label: "Books", icon: "📚" },
  { id: "pages", label: "Pages", icon: "📖" },
  { id: "minutes", label: "Minutes", icon: "⏱️" },
];

const timeframes = ["This year", "This quarter", "Next 6 months"];

function App() {
  const [goalType, setGoalType] = useState("books");
  const [goalValue, setGoalValue] = useState(24);
  const [timeframe, setTimeframe] = useState("This year");
  const [pace, setPace] = useState(2);
  const [genre, setGenre] = useState("Fantasy");
  const [reminders, setReminders] = useState(true);
  const [weeklyReview, setWeeklyReview] = useState(true);

  const monthlyTarget = useMemo(() => {
    const monthsMap = {
      "This year": 12,
      "This quarter": 3,
      "Next 6 months": 6,
    };

    const months = monthsMap[timeframe] ?? 12;
    if (goalType === "pages") {
      return Math.round(goalValue / months);
    }
    if (goalType === "minutes") {
      return Math.round(goalValue / months);
    }
    return (goalValue / months).toFixed(1);
  }, [goalType, goalValue, timeframe]);

  const paceLabel = useMemo(() => {
    if (goalType === "books") {
      return `${pace} books per month`;
    }
    if (goalType === "pages") {
      return `${pace * 200} pages per month`;
    }
    return `${pace * 30} minutes per day`;
  }, [goalType, pace]);

  const summaryLabel =
    goalType === "books"
      ? "books"
      : goalType === "pages"
        ? "pages"
        : "minutes";

  return (
    <div className="page-shell">
      <div className="goal-layout">
        <main className="goal-card main-panel">
          <div className="header-row">
            <div>
              <p className="eyebrow">Reading dashboard</p>
              <h1>Set your reading goal</h1>
            </div>
            <button type="button" className="ghost-button">
              Save draft
            </button>
          </div>

          <section className="goal-type-section">
            <p className="section-label">Goal type</p>
            <div className="goal-type-row" aria-label="Goal type selector">
              {goalTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`type-pill ${goalType === type.id ? "active" : ""}`}
                  onClick={() => setGoalType(type.id)}
                >
                  <span aria-hidden="true">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </section>

          <section className="form-grid">
            <label className="field">
              <span className="field-label">Target amount</span>
              <div className="input-wrap">
                <input
                  type="number"
                  min="1"
                  value={goalValue}
                  onChange={(event) => setGoalValue(Number(event.target.value) || 1)}
                />
                <span className="suffix">{summaryLabel}</span>
              </div>
            </label>

            <label className="field">
              <span className="field-label">Time period</span>
              <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
                {timeframes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="pace-block">
            <div className="pace-topline">
              <p className="section-label">Reading pace</p>
              <strong>{paceLabel}</strong>
            </div>
            <input
              type="range"
              min="1"
              max={goalType === "books" ? 8 : goalType === "pages" ? 12 : 10}
              step="1"
              value={pace}
              onChange={(event) => setPace(Number(event.target.value))}
              aria-label="Reading pace"
            />
          </section>

          <section className="form-grid secondary-grid">
            <label className="field">
              <span className="field-label">Favorite genre</span>
              <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                <option>Fantasy</option>
                <option>Historical fiction</option>
                <option>Nonfiction</option>
                <option>Mystery</option>
                <option>Science fiction</option>
              </select>
            </label>

            <label className="field">
              <span className="field-label">Reading style</span>
              <select defaultValue="Evening reading">
                <option>Evening reading</option>
                <option>Weekend deep dives</option>
                <option>Commute reading</option>
                <option>Morning routine</option>
              </select>
            </label>
          </section>

          <section className="toggle-list">
            <label className="toggle-item">
              <span>
                <strong>Weekly reminders</strong>
                <small>Keep your streak going</small>
              </span>
              <input
                type="checkbox"
                checked={reminders}
                onChange={() => setReminders((value) => !value)}
              />
            </label>

            <label className="toggle-item">
              <span>
                <strong>Monthly review</strong>
                <small>Reflect on what you finished</small>
              </span>
              <input
                type="checkbox"
                checked={weeklyReview}
                onChange={() => setWeeklyReview((value) => !value)}
              />
            </label>
          </section>

          <div className="button-row">
            <button type="button" className="secondary-button">
              Cancel
            </button>
            <button type="button" className="primary-button">
              Save goal
            </button>
          </div>
        </main>

        <aside className="goal-card sidebar-panel">
          <p className="eyebrow muted">Your plan</p>
          <div className="score-box">
            <div className="score-value">{goalValue}</div>
            <div className="score-label">{summaryLabel}</div>
          </div>

          <ul className="summary-list">
            <li>
              <span>Monthly pace</span>
              <strong>{monthlyTarget}</strong>
            </li>
            <li>
              <span>Preferred genre</span>
              <strong>{genre}</strong>
            </li>
            <li>
              <span>Reminder mode</span>
              <strong>{reminders ? "On" : "Off"}</strong>
            </li>
          </ul>

          <div className="tip-card">
            <p className="tip-label">Smart suggestion</p>
            <h2>Keep it realistic</h2>
            <p>
              Aim for about <strong>{paceLabel}</strong> to stay ahead and still enjoy your current shelf.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
