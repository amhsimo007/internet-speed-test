// ========================================
// 1. Quality Levels
// ========================================

const VIDEO_QUALITY_LEVELS = {
    excellent: {
        label: "Excellent",
        description: "Your connection looks well suited for video calls.",
    },

    good: {
        label: "Good",
        description: "Your connection should support most video calls.",
    },

    fair: {
        label: "Fair",
        description:
            "You may need to reduce video quality during busy periods.",
    },

    poor: {
        label: "Poor",
        description: "Your connection may struggle with video calls.",
    },
};

// ========================================
// 2. Metric Classification
// ========================================

function classifyDownload(downloadMbps) {
    if (downloadMbps >= 10) return "excellent";
    if (downloadMbps >= 5) return "good";
    if (downloadMbps >= 2) return "fair";

    return "poor";
}

function classifyUpload(uploadMbps) {
    if (uploadMbps >= 5) return "excellent";
    if (uploadMbps >= 2.5) return "good";
    if (uploadMbps >= 1) return "fair";

    return "poor";
}

function classifyLatency(latency) {
    if (latency <= 50) return "excellent";
    if (latency <= 100) return "good";
    if (latency <= 150) return "fair";

    return "poor";
}

function classifyJitter(jitter) {
    if (jitter <= 10) return "excellent";
    if (jitter <= 20) return "good";
    if (jitter <= 30) return "fair";

    return "poor";
}

// ========================================
// 3. Quality Ranking
// ========================================

const QUALITY_RANK = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
};

// ========================================
// 4. Main Business Logic
// ========================================

export function evaluateVideoCallQuality(results) {
    if (!results || typeof results !== "object") {
        return null;
    }

    const download =
        results.download == null ? null : results.download / 1_000_000;

    const upload = results.upload == null ? null : results.upload / 1_000_000;

    const { latency, jitter } = results;

    const values = {
        download,
        upload,
        latency,
        jitter,
    };

    // Validate every required measurement.
    if (
        Object.values(values).some(
            (value) => !Number.isFinite(value) || value < 0,
        )
    ) {
        return null;
    }

    // Classify each metric independently.
    const metrics = {
        download: classifyDownload(download),
        upload: classifyUpload(upload),
        latency: classifyLatency(latency),
        jitter: classifyJitter(jitter),
    };

    // Use the weakest metric for a conservative rating.
    const overall = Object.values(metrics).reduce(
        (worst, current) =>
            QUALITY_RANK[current] < QUALITY_RANK[worst] ? current : worst,
        "excellent",
    );

    return {
        overall,
        ...VIDEO_QUALITY_LEVELS[overall],
        metrics,
        values,
    };
}
