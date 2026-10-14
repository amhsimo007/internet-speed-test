import "./SpeedGauge.css";

// ========================================
// Constants
// ========================================

const MAX_DISPLAY_SPEED = 1000;

// ========================================
// Helper Functions
// ========================================

function normalizeSpeed(speed) {
    if (typeof speed !== "number" || !Number.isFinite(speed) || speed < 0) {
        return 0;
    }

    return speed;
}

function calculateGaugePercentage(speed) {
    return Math.min((speed / MAX_DISPLAY_SPEED) * 100, 100);
}

// ========================================
// Component
// ========================================

function SpeedGauge({ title = "Download Speed", speed = null, unit = "Mbps" }) {
    const hasValidSpeed =
        typeof speed === "number" && Number.isFinite(speed) && speed >= 0;

    const normalizedSpeed = normalizeSpeed(speed);

    const percentage = calculateGaugePercentage(normalizedSpeed);

    const displayedSpeed = hasValidSpeed ? normalizedSpeed.toFixed(2) : "--";

    return (
        <section className="speed-gauge" aria-label={title}>
            <h2 className="speed-gauge__title">{title}</h2>

            <div
                className="speed-gauge__meter"
                role="meter"
                aria-label={title}
                aria-valuemin={0}
                aria-valuemax={MAX_DISPLAY_SPEED}
                aria-valuenow={Math.min(normalizedSpeed, MAX_DISPLAY_SPEED)}
                style={{
                    "--gauge-percentage": `${percentage}%`,
                }}>
                <div className="speed-gauge__value">
                    <span className="speed-gauge__number">
                        {displayedSpeed}
                    </span>

                    <span className="speed-gauge__unit">{unit}</span>
                </div>
            </div>
        </section>
    );
}

export default SpeedGauge;
