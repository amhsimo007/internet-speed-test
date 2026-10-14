
function TestButton({ status, onStart }) {
  const isRunning = [
    "latency",
    "download",
    "upload",
  ].includes(status);

  return (
    <button
      className="start-button"
      onClick={onStart}
      disabled={isRunning}
    >
      {isRunning ? "Testing..." : "Start Test"}
    </button>
  );
}

export default TestButton;