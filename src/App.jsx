import styles from "./App.module.css";
import ReadingGoalForm from "./components/ReadingGoalForm";

function App() {
  return (
    <main className={styles.appShell}>
      <ReadingGoalForm />
    </main>
  );
}

export default App;
