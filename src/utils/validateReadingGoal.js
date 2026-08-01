export function validateReadingGoal({ goal, startDate }) {
  const errors = {};

  if (goal === "" || goal === null || goal === undefined) {
    errors.goal = "Goal is required";
  } else {
    const numericGoal = Number(goal);

    if (!Number.isInteger(numericGoal)) {
      errors.goal = "Goal must be a whole number";
    } else if (numericGoal < 1) {
      errors.goal = "Goal must be at least 1 book";
    } else if (numericGoal > 500) {
      errors.goal = "Goal must be 500 books or fewer";
    }
  }

  if (!startDate) {
    errors.startDate = "Start date is required";
  } else {
    const date = new Date(`${startDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(date.getTime())) {
      errors.startDate = "Start date is required";
    } else if (date > today) {
      errors.startDate = "Start date can't be in the future";
    }
  }

  return errors;
}

export function calculateBooksPerMonth(goal, startDate) {
  if (!goal || !startDate) {
    return 0;
  }

  const totalGoal = Number(goal);
  const start = new Date(`${startDate}T00:00:00`);
  const yearEnd = new Date(start.getFullYear(), 11, 31);

  const diffInDays = Math.max(
    0,
    Math.ceil((yearEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
      1,
  );

  const monthsRemaining = Math.max(1, Math.ceil(diffInDays / 30));
  return Number((totalGoal / monthsRemaining).toFixed(1));
}
