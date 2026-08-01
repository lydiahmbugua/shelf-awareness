import { useMemo, useState } from "react";
import styles from "./ReadingGoalForm.module.css";
import {
  calculateBooksPerMonth,
  validateReadingGoal,
} from "../utils/validateReadingGoal";

const getDefaultDate = () => new Date().toISOString().slice(0, 10);

function ReadingGoalForm() {
  const [goal, setGoal] = useState(24);
  const [startDate, setStartDate] = useState(getDefaultDate());
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const booksPerMonth = useMemo(
    () => calculateBooksPerMonth(goal, startDate),
    [goal, startDate],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateReadingGoal({ goal, startDate });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    localStorage.setItem(
      "reading-goal",
      JSON.stringify({ goal: Number(goal), startDate }),
    );
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor="annual-goal">Annual reading goal</label>
        <input
          id="annual-goal"
          name="goal"
          type="number"
          min="1"
          max="500"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          aria-invalid={Boolean(errors.goal)}
          aria-describedby={errors.goal ? "goal-error" : undefined}
        />
        {errors.goal && (
          <p id="goal-error" role="alert" className={styles.errorText}>
            {errors.goal}
          </p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="start-date">Start date</label>
        <input
          id="start-date"
          name="startDate"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          aria-invalid={Boolean(errors.startDate)}
          aria-describedby={errors.startDate ? "start-date-error" : undefined}
        />
        {errors.startDate && (
          <p id="start-date-error" role="alert" className={styles.errorText}>
            {errors.startDate}
          </p>
        )}
      </div>

      <p aria-live="polite" className={styles.summary}>
        You need to read ~{booksPerMonth.toFixed(1)} books/month
      </p>

      <button type="submit" className={styles.button}>
        Save goal
      </button>
      {saved && <p className={styles.successText}>Goal saved successfully.</p>}
    </form>
  );
}

export default ReadingGoalForm;
