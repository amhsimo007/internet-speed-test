// ========================================
// 1. Quality Levels
// ========================================

const GAMING_LEVELS = {
    excellent: {
        label: "Excellent",
        description: "Your connection looks suitable for competitive gaming.",
    },

    good: {
        label: "Good",
        description: "Your connection should work well for most online games.",
    },

    fair: {
        label: "Fair",
        description: "You may experience occasional delays in online games.",
    },

    poor: {
        label: "Poor",
        description: "Your connection may cause noticeable gaming delays.",
    },
};

// ========================================
// 2. Latency Classification
// ========================================

function classifyGamingLatency(latency) {
    if (latency <= 20) return "excellent";
    if (latency <= 50) return "good";
    if (latency <= 100) return "fair";

    return "poor";
}

// ========================================
// 3. Jitter Classification
// ========================================

function classifyGamingJitter(jitter) {
    if (jitter <= 5) return "excellent";
    if (jitter <= 15) return "good";
    if (jitter <= 30) return "fair";

    return "poor";
}

// ========================================
// 4. Quality Ranking
// ========================================

const QUALITY_RANK = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
};

// ========================================
// 5. Main Business Logic
// ========================================

export function evaluateGamingQuality(results) {
    if (!results || typeof results !== "object") {
        return null;
    }

    const { latency, jitter } = results;

    if (
        !Number.isFinite(latency) ||
        !Number.isFinite(jitter) ||
        latency < 0 ||
        jitter < 0
    ) {
        return null;
    }

    const latencyQuality = classifyGamingLatency(latency);
    const jitterQuality = classifyGamingJitter(jitter);

    const metrics = {
        latency: latencyQuality,
        jitter: jitterQuality,
    };

    // Use the weaker metric for a conservative overall rating.
    const overall = Object.entries(metrics).reduce(
        (worst, [, quality]) =>
            QUALITY_RANK[quality] < QUALITY_RANK[worst] ? quality : worst,
        "excellent",
    );

    return {
        overall,
        ...GAMING_LEVELS[overall],
        metrics,
        values: {
            latency,
            jitter,
        },
    };
}
