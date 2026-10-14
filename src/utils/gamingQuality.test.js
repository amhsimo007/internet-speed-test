import { describe, it, expect } from "vitest";

import { evaluateGamingQuality } from "./gamingQuality.js";

describe("evaluateGamingQuality", () => {
    it("returns excellent when latency and jitter are excellent", () => {
        const result = evaluateGamingQuality({
            latency: 18,
            jitter: 4,
        });

        expect(result.overall).toBe("excellent");
    });

    it("returns fair when jitter is fair even if latency is good", () => {
        const result = evaluateGamingQuality({
            latency: 25,
            jitter: 22,
        });

        expect(result.overall).toBe("fair");
    });

    it("returns poor when latency is poor", () => {
        const result = evaluateGamingQuality({
            latency: 120,
            jitter: 4,
        });

        expect(result.overall).toBe("poor");
    });

    it("returns null when measurements are missing", () => {
        const result = evaluateGamingQuality({
            latency: null,
            jitter: 5,
        });

        expect(result).toBeNull();
    });

    it("returns null for negative measurements", () => {
        const result = evaluateGamingQuality({
            latency: -1,
            jitter: 5,
        });

        expect(result).toBeNull();
    });
});
