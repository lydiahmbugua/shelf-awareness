import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ReadingGoalForm from "./ReadingGoalForm";

const getTodayString = () => new Date().toISOString().slice(0, 10);

describe("ReadingGoalForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits a valid goal and saves to localStorage", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);

    await user.clear(goalInput);
    await user.type(goalInput, "24");
    await user.clear(dateInput);
    await user.type(dateInput, getTodayString());

    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(screen.getByText(/goal saved successfully/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("reading-goal"))).toMatchObject({
      goal: 24,
      startDate: getTodayString(),
    });
  });

  it("shows the correct error when goal is 0", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);

    await user.clear(goalInput);
    await user.type(goalInput, "0");
    await user.clear(dateInput);
    await user.type(dateInput, getTodayString());
    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(
      screen.getByText(/goal must be at least 1 book/i),
    ).toBeInTheDocument();
  });

  it("shows the correct error when goal is 501", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);

    await user.clear(goalInput);
    await user.type(goalInput, "501");
    await user.clear(dateInput);
    await user.type(dateInput, getTodayString());
    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(
      screen.getByText(/goal must be 500 books or fewer/i),
    ).toBeInTheDocument();
  });

  it("shows the correct error for a non-integer goal", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);

    await user.clear(goalInput);
    await user.type(goalInput, "12.5");
    await user.clear(dateInput);
    await user.type(dateInput, getTodayString());
    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(
      screen.getByText(/goal must be a whole number/i),
    ).toBeInTheDocument();
  });

  it("shows the correct error for a future date", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().slice(0, 10);

    await user.clear(goalInput);
    await user.type(goalInput, "24");
    await user.clear(dateInput);
    await user.type(dateInput, tomorrowString);
    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(
      screen.getByText(/start date can't be in the future/i),
    ).toBeInTheDocument();
  });

  it("shows errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<ReadingGoalForm />);

    const goalInput = screen.getByLabelText(/annual reading goal/i);
    const dateInput = screen.getByLabelText(/start date/i);

    await user.clear(goalInput);
    await user.clear(dateInput);
    await user.click(screen.getByRole("button", { name: /save goal/i }));

    expect(screen.getByText(/goal is required/i)).toBeInTheDocument();
    expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
  });
});
