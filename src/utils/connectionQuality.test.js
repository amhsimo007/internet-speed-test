import { describe, it, expect } from "vitest";

import { evaluateConnection } from "./connectionQuality.js";

describe("evaluateConnection", () => {
    it("returns excellent for an excellent connection", () => {
        const result = evaluateConnection({
            download: 100_000_000,
            upload: 50_000_000,
            latency: 10,
            jitter: 2,
        });

        expect(result.overall).toBe("excellent");
        expect(result.metrics.download).toBe("excellent");
        expect(result.metrics.upload).toBe("excellent");
        expect(result.metrics.latency).toBe("excellent");
        expect(result.metrics.jitter).toBe("excellent");
    });

    it("converts download and upload speeds to Mbps", () => {
        const result = evaluateConnection({
            download: 100_000_000,
            upload: 20_000_000,
            latency: 10,
            jitter: 2,
        });

        expect(result.values.download).toBe(100);
        expect(result.values.upload).toBe(20);
    });

    it("classifies metrics at their exact thresholds", () => {
        const result = evaluateConnection({
            download: 50_000_000,
            upload: 20_000_000,
            latency: 20,
            jitter: 5,
        });

        expect(result.metrics.download).toBe("excellent");
        expect(result.metrics.upload).toBe("excellent");
        expect(result.metrics.latency).toBe("excellent");
        expect(result.metrics.jitter).toBe("excellent");
    });

    it("returns fair for a connection with fair metrics", () => {
        const result = evaluateConnection({
            download: 10_000_000,
            upload: 3_000_000,
            latency: 80,
            jitter: 25,
        });

        expect(result.overall).toBe("fair");
        expect(result.metrics.download).toBe("fair");
        expect(result.metrics.upload).toBe("fair");
        expect(result.metrics.latency).toBe("fair");
        expect(result.metrics.jitter).toBe("fair");
    });

    it("returns poor when all metrics are poor", () => {
        const result = evaluateConnection({
            download: 5_000_000,
            upload: 1_000_000,
            latency: 120,
            jitter: 40,
        });

        expect(result.overall).toBe("poor");
    });

    it("returns null when a required measurement is missing", () => {
        const result = evaluateConnection({
            download: 100_000_000,
            upload: 20_000_000,
            latency: 10,
            jitter: null,
        });

        expect(result).toBeNull();
    });

    it("returns null when a measurement is negative", () => {
        const result = evaluateConnection({
            download: 100_000_000,
            upload: 20_000_000,
            latency: -1,
            jitter: 2,
        });

        expect(result).toBeNull();
    });

    it("returns null when a measurement is Infinity", () => {
        const result = evaluateConnection({
            download: Infinity,
            upload: 20_000_000,
            latency: 10,
            jitter: 2,
        });

        expect(result).toBeNull();
    });
});
