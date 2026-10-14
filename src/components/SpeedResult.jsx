import "./SpeedResult.css";

// ========================================
// Constants
// ========================================

const RESULT_ITEMS = [
    {
        key: "download",
        label: "Download",
        unit: "Mbps",
        description: "Download speed",
    },
    {
        key: "upload",
        label: "Upload",
        unit: "Mbps",
        description: "Upload speed",
    },
    {
        key: "latency",
        label: "Latency",
        unit: "ms",
        description: "Connection response time",
    },
    {
        key: "jitter",
        label: "Jitter",
        unit: "ms",
        description: "Variation in response time",
    },
];

// ========================================
// Helper Functions
// ========================================

function formatResult(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        return "--";
    }

    return value.toFixed(2);
}

// ========================================
// Component
// ========================================

function SpeedResult({ results = {} }) {
    return (
        <section
            className="speed-results"
            aria-labelledby="speed-results-title">
            {" "}
            <h2 id="speed-results-title" className="speed-results__title">
                Test Results{" "}
            </h2>
            ```
            <div className="speed-results__grid">
                {RESULT_ITEMS.map((item) => (
                    <article
                        className="speed-results__item"
                        key={item.key}
                        aria-label={item.description}>
                        <h3 className="speed-results__label">{item.label}</h3>

                        <p className="speed-results__value">
                            <span>{formatResult(results[item.key])}</span>

                            <span className="speed-results__unit">
                                {item.unit}
                            </span>
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default SpeedResult;
