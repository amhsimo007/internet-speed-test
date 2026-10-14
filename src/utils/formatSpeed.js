export function toMbps(bitsPerSecond) {
    if (
        typeof bitsPerSecond !== "number" ||
        !Number.isFinite(bitsPerSecond) ||
        bitsPerSecond < 0
    ) {
        return null;
    }

    return bitsPerSecond / 1_000_000;
}

export function formatSpeed(bitsPerSecond) {
    const mbps = toMbps(bitsPerSecond);

    if (mbps === null) {
        return "--";
    }

    return mbps.toFixed(2);
}

export function formatMilliseconds(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        return "--";
    }

    return value.toFixed(1);
}
