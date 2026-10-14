import { evaluateVideoCallQuality } from "../utils/videoCallQuality.js";

// ========================================
// 1. Constants
// ========================================

const QUALITY_LABELS = {
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
};

const METRIC_LABELS = {
    download: "Download Speed",
    upload: "Upload Speed",
    latency: "Latency",
    jitter: "Jitter",
};

// ========================================
// 2. Component
// ========================================

function VideoCallQuality({ results }) {
    const quality = evaluateVideoCallQuality(results);

    if (!quality) {
        return (
            <section className="video-quality-panel">
                <h2>🎥 Video Call Quality</h2>

                <p>
                    Complete a speed test to evaluate your connection for video
                    calls.
                </p>
            </section>
        );
    }

    const { overall, description, metrics, values } = quality;

    return (
        <section className={`video-quality-panel video-quality-${overall}`}>
            <div className="video-quality-header">
                <div>
                    <h2>🎥 Video Call Quality</h2>
                    <p>{description}</p>
                </div>

                <span
                    className={`video-quality-badge video-quality-badge-${overall}`}>
                    {QUALITY_LABELS[overall]}
                </span>
            </div>

            <div className="video-quality-grid">
                {Object.entries(metrics).map(([key, level]) => {
                    const value = values[key];

                    const formattedValue =
                        key === "download" || key === "upload"
                            ? `${value.toFixed(2)} Mbps`
                            : `${value.toFixed(1)} ms`;

                    return (
                        <article className="video-quality-metric" key={key}>
                            <span>{METRIC_LABELS[key]}</span>

                            <strong>{formattedValue}</strong>

                            <span
                                className={`video-quality-status video-quality-status-${level}`}>
                                {QUALITY_LABELS[level]}
                            </span>
                        </article>
                    );
                })}
            </div>

            <div className="video-quality-tips">
                <h3>Tips for better video calls</h3>

                <ul>
                    <li>Use a stable Wi-Fi connection or Ethernet.</li>
                    <li>Pause large downloads and uploads during calls.</li>
                    <li>
                        Move closer to your Wi-Fi router if the signal is weak.
                    </li>
                    <li>
                        Close applications that consume excessive bandwidth.
                    </li>
                </ul>
            </div>

            <p className="video-quality-note">
                This is an estimate based on a speed test. Actual call quality
                also depends on packet loss, network stability, device
                performance, and the video conferencing service.
            </p>
        </section>
    );
}

export default VideoCallQuality;
