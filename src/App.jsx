import { useState } from 'react';
import BreedQuiz from './components/BreedQuiz';
import Scoreboard from './components/Scoreboard';

export default function App() {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const onScore = (delta) => {
    setAttempts(a => a + 1);
    setScore(s => s + delta);
  };

  const reset = () => {
    setScore(0);
    setAttempts(0);
    window.location.reload();
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Guess the Dog Breed</h1>
        <p>How many breeds can you recognize?</p>
        <Scoreboard score={score} total={attempts} />
      </header>

      <BreedQuiz onScore={onScore} />

      <footer className="footer">
        <button onClick={reset}>Reset game</button>
        <p>
          Images courtesy of Dog CEO API. This game is for fun and might show mixed or rare breeds.
        </p>
      </footer>
    </div>
  );
}