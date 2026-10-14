const QUALITY_LEVELS = {
    excellent: {
        label: "Excellent",
        description: "Your connection is performing very well.",
    },

    good: {
        label: "Good",
        description: "Your connection is suitable for most activities.",
    },

    fair: {
        label: "Fair",
        description: "Your connection may have some limitations.",
    },

    poor: {
        label: "Poor",
        description: "Your connection may need improvement.",
    },
};

function classifyDownload(download) {
    if (download >= 50) return "excellent";
    if (download >= 25) return "good";
    if (download >= 10) return "fair";

    return "poor";
}

function classifyUpload(upload) {
    if (upload >= 20) return "excellent";
    if (upload >= 10) return "good";
    if (upload >= 3) return "fair";

    return "poor";
}

function classifyLatency(latency) {
    if (latency <= 20) return "excellent";
    if (latency <= 50) return "good";
    if (latency <= 100) return "fair";

    return "poor";
}

function classifyJitter(jitter) {
    if (jitter <= 5) return "excellent";
    if (jitter <= 15) return "good";
    if (jitter <= 30) return "fair";

    return "poor";
}

const QUALITY_SCORES = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
};

export function evaluateConnection(results) {
    const download =
        results.download == null ? null : results.download / 1_000_000;

    const upload = results.upload == null ? null : results.upload / 1_000_000;

    const latency = results.latency;
    const jitter = results.jitter;

    if (
        download == null ||
        upload == null ||
        latency == null ||
        jitter == null ||
        !Number.isFinite(download) ||
        !Number.isFinite(upload) ||
        !Number.isFinite(latency) ||
        !Number.isFinite(jitter) ||
        download < 0 ||
        upload < 0 ||
        latency < 0 ||
        jitter < 0
    ) {
        return null;
    }

    const metrics = {
        download: classifyDownload(download),
        upload: classifyUpload(upload),
        latency: classifyLatency(latency),
        jitter: classifyJitter(jitter),
    };

    const averageScore =
        Object.values(metrics).reduce(
            (total, level) => total + QUALITY_SCORES[level],
            0,
        ) / Object.keys(metrics).length;

    let overall;

    if (averageScore >= 3.5) {
        overall = "excellent";
    } else if (averageScore >= 2.5) {
        overall = "good";
    } else if (averageScore >= 1.75) {
        overall = "fair";
    } else {
        overall = "poor";
    }

    return {
        overall,
        ...QUALITY_LEVELS[overall],
        metrics,
        values: {
            download,
            upload,
            latency,
            jitter,
        },
    };
}
