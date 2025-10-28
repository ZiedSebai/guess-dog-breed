export default function Scoreboard({ score, total }) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <div className="scoreboard">
      <strong>Score:</strong> {score} / {total} ({pct}%)
    </div>
  );
}