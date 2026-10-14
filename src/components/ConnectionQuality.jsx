import { evaluateConnection } from "../utils/connectionQuality.js";

const METRIC_LABELS = {
  download: "Download Speed",
  upload: "Upload Speed",
  latency: "Latency",
  jitter: "Jitter",
};

const QUALITY_LABELS = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

function ConnectionQuality({ results }) {
  const quality = evaluateConnection(results);

  if (!quality) {
    return (
      <section className="quality-panel">
        <div className="quality-header">
          <h2>Connection Quality</h2>
        </div>

        <p className="quality-empty">
          Complete a speed test to evaluate your connection quality.
        </p>
      </section>
    );
  }

  const { overall, description, metrics, values } = quality;

  return (
    <section className={`quality-panel quality-${overall}`}>
      <div className="quality-header">
        <div>
          <h2>Connection Quality</h2>
          <p>{description}</p>
        </div>

        <span className={`quality-badge quality-badge-${overall}`}>
          {QUALITY_LABELS[overall]}
        </span>
      </div>

      <div className="quality-metrics">
        {Object.entries(metrics).map(([key, level]) => {
          const value = values[key];

          const formattedValue =
            key === "download" || key === "upload"
              ? `${value.toFixed(2)} Mbps`
              : `${value.toFixed(1)} ms`;

          return (
            <article className="quality-metric" key={key}>
              <div className="quality-metric-header">
                <span>{METRIC_LABELS[key]}</span>

                <span className={`quality-status quality-status-${level}`}>
                  {QUALITY_LABELS[level]}
                </span>
              </div>

              <strong>{formattedValue}</strong>
            </article>
          );
        })}
      </div>

      <p className="quality-note">
        This rating is an estimate based on your measured download,
        upload, latency, and jitter results. Actual performance
        depends on your intended use and network conditions.
      </p>
    </section>
  );
}

export default ConnectionQuality;