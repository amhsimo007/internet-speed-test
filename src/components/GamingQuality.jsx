import { evaluateGamingQuality } from "../utils/gamingQuality.js";

// ========================================
// 1. Constants
// ========================================

const QUALITY_LABELS = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

// ========================================
// 2. Component
// ========================================

function GamingQuality({ results }) {
  const quality = evaluateGamingQuality(results);

  // Do not display a rating until valid measurements exist.
  if (!quality) {
    return (
      <section className="gaming-panel">
        <div className="gaming-header">
          <h2>🎮 Gaming Quality</h2>
        </div>

        <p className="gaming-empty">
          Complete a speed test to evaluate your connection for gaming.
        </p>
      </section>
    );
  }

  const { overall, description, metrics, values } = quality;

  return (
    <section className={`gaming-panel gaming-${overall}`}>
      <div className="gaming-header">
        <div>
          <h2>🎮 Gaming Quality</h2>
          <p>{description}</p>
        </div>

        <span className={`gaming-badge gaming-badge-${overall}`}>
          {QUALITY_LABELS[overall]}
        </span>
      </div>

      <div className="gaming-metrics">
        <article className="gaming-metric">
          <span className="gaming-metric-label">
            ⚡ Latency
          </span>

          <strong>
            {values.latency.toFixed(1)} ms
          </strong>

          <span
            className={`gaming-status gaming-status-${metrics.latency}`}
          >
            {QUALITY_LABELS[metrics.latency]}
          </span>
        </article>

        <article className="gaming-metric">
          <span className="gaming-metric-label">
            〰 Jitter
          </span>

          <strong>
            {values.jitter.toFixed(1)} ms
          </strong>

          <span
            className={`gaming-status gaming-status-${metrics.jitter}`}
          >
            {QUALITY_LABELS[metrics.jitter]}
          </span>
        </article>
      </div>

      <div className="gaming-tips">
        <h3>How to improve your gaming connection</h3>

        <ul>
          <li>Use Ethernet when possible.</li>
          <li>Choose a game server close to your location.</li>
          <li>Pause downloads while playing.</li>
          <li>Avoid network congestion when possible.</li>
        </ul>
      </div>

      <p className="gaming-note">
        This rating estimates connection quality from latency and jitter
        measured by the speed test. Your actual in-game performance may
        differ because the game server, routing, and packet loss also matter.
      </p>
    </section>
  );
}

export default GamingQuality;