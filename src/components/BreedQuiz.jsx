import { useEffect, useMemo, useState } from 'react';
import { getBreedList, getRandomImageAndBreed } from '../api/dogApi';

const SHUFFLE = arr => [...arr].sort(() => Math.random() - 0.5);
const pickN = (arr, n, exclude) => {
  const pool = arr.filter(b => b !== exclude);
  const shuffled = SHUFFLE(pool);
  return shuffled.slice(0, n);
};

export default function BreedQuiz({ onScore }) {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [answerBreed, setAnswerBreed] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState('');
  const [round, setRound] = useState(1);

  const maxRounds = 10;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getBreedList();
        if (mounted) setBreeds(list);
        await newRound(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const newRound = async (list = breeds) => {
    setLoading(true);
    setSelected('');
    setFeedback('');
    try {
      const { url, breedName } = await getRandomImageAndBreed();
      const distractors = pickN(list, 3, breedName);
      const opts = SHUFFLE([breedName, ...distractors]);
      setImageUrl(url);
      setAnswerBreed(breedName);
      setOptions(opts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === answerBreed;
    setFeedback(correct ? 'Correct!' : `Oops — it was "${answerBreed}"`);
    onScore(correct ? 1 : 0);
  };

  const next = () => {
    if (round >= maxRounds) return;
    setRound(r => r + 1);
    newRound();
  };

  const progress = useMemo(() => Math.round((round - 1) / maxRounds * 100), [round]);

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
        <p>Round {round} of {maxRounds}</p>
      </div>

      {loading ? (
        <div className="loader">Fetching a very good dog…</div>
      ) : (
        <>
          <div className="image-wrap">
            {imageUrl && <img src={imageUrl} alt="Guess the breed" />}
          </div>

          <ul className="options">
            {options.map(opt => (
              <li key={opt}>
                <button
                  className={`option ${selected
                    ? opt === answerBreed ? 'correct' : opt === selected ? 'wrong' : ''
                    : ''}`}
                  onClick={() => handleSelect(opt)}
                  disabled={!!selected}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>

          {feedback && <p className="feedback">{feedback}</p>}

          <div className="actions">
            <button onClick={() => newRound()} disabled={!feedback || round >= maxRounds}>
              New image
            </button>
            <button onClick={next} disabled={!feedback || round >= maxRounds}>
              Next round
            </button>
          </div>
        </>
      )}
    </div>
  );
}