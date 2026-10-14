import { describe, it, expect } from "vitest";

import { evaluateVideoCallQuality } from "./videoCallQuality.js";

describe("evaluateVideoCallQuality", () => {
    it("returns excellent when all metrics are excellent", () => {
        const result = evaluateVideoCallQuality({
            download: 50_000_000,
            upload: 10_000_000,
            latency: 20,
            jitter: 5,
        });

        expect(result.overall).toBe("excellent");
    });

    it("classifies each metric independently", () => {
        const result = evaluateVideoCallQuality({
            download: 7_000_000,
            upload: 3_000_000,
            latency: 80,
            jitter: 15,
        });

        expect(result.metrics.download).toBe("good");
        expect(result.metrics.upload).toBe("good");
        expect(result.metrics.latency).toBe("good");
        expect(result.metrics.jitter).toBe("good");
    });

    it("uses the weakest metric for the overall rating", () => {
        const result = evaluateVideoCallQuality({
            download: 50_000_000,
            upload: 10_000_000,
            latency: 20,
            jitter: 35,
        });

        expect(result.metrics.download).toBe("excellent");
        expect(result.metrics.upload).toBe("excellent");
        expect(result.metrics.latency).toBe("excellent");
        expect(result.metrics.jitter).toBe("poor");

        expect(result.overall).toBe("poor");
    });

    it("returns fair when jitter is fair and other metrics are excellent", () => {
        const result = evaluateVideoCallQuality({
            download: 50_000_000,
            upload: 10_000_000,
            latency: 20,
            jitter: 25,
        });

        expect(result.metrics.jitter).toBe("fair");
        expect(result.overall).toBe("fair");
    });

    it("returns null when a required measurement is missing", () => {
        const result = evaluateVideoCallQuality({
            download: 50_000_000,
            upload: 10_000_000,
            latency: 20,
            jitter: null,
        });

        expect(result).toBeNull();
    });

    it("returns null when the input is null", () => {
        expect(evaluateVideoCallQuality(null)).toBeNull();
    });

    it("returns null when a measurement is negative", () => {
        const result = evaluateVideoCallQuality({
            download: 50_000_000,
            upload: 10_000_000,
            latency: -1,
            jitter: 5,
        });

        expect(result).toBeNull();
    });

    it("returns null when a measurement is NaN", () => {
        const result = evaluateVideoCallQuality({
            download: NaN,
            upload: 10_000_000,
            latency: 20,
            jitter: 5,
        });

        expect(result).toBeNull();
    });
});
