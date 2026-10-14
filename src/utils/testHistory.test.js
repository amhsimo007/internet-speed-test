import { beforeEach, describe, it, expect, vi } from "vitest";

import {
    getTestHistory,
    saveTestToHistory,
    clearTestHistory,
} from "./testHistory.js";

// ========================================
// Mock localStorage
// ========================================

function createStorageMock() {
    let store = {};

    return {
        getItem: vi.fn((key) => {
            return Object.prototype.hasOwnProperty.call(store, key)
                ? store[key]
                : null;
        }),

        setItem: vi.fn((key, value) => {
            store[key] = String(value);
        }),

        removeItem: vi.fn((key) => {
            delete store[key];
        }),

        clear: vi.fn(() => {
            store = {};
        }),
    };
}

// ========================================
// Test Data
// ========================================

const STORAGE_KEY = "netspeed-test-history";

const sampleResults = {
    download: 100_000_000,
    upload: 50_000_000,

    latency: 20,
    jitter: 3,

    downloadLatency: 30,
    uploadLatency: 40,

    downloadJitter: 4,
    uploadJitter: 5,

    duration: 10000,
};

// ========================================
// Tests
// ========================================

describe("testHistory utilities", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", createStorageMock());
    });

    it("returns an empty array when history does not exist", () => {
        expect(getTestHistory()).toEqual([]);
    });

    it("returns saved history from localStorage", () => {
        const history = [
            {
                id: "test-1",
                download: 100_000_000,
            },
        ];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

        expect(getTestHistory()).toEqual(history);
    });

    it("returns an empty array when saved JSON is invalid", () => {
        localStorage.setItem(STORAGE_KEY, "{invalid json");

        expect(getTestHistory()).toEqual([]);
    });

    it("returns an empty array when saved data is not an array", () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ download: 100_000_000 }),
        );

        expect(getTestHistory()).toEqual([]);
    });

    it("saves a test and returns the updated history", () => {
        const history = saveTestToHistory(sampleResults);

        expect(history).toHaveLength(1);
        expect(history[0].download).toBe(sampleResults.download);
        expect(history[0].upload).toBe(sampleResults.upload);

        expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(history);
    });

    it("adds the newest test to the beginning of history", () => {
        const firstTest = saveTestToHistory({
            ...sampleResults,
            download: 10_000_000,
        })[0];

        const history = saveTestToHistory({
            ...sampleResults,
            download: 200_000_000,
        });

        expect(history).toHaveLength(2);
        expect(history[0].download).toBe(200_000_000);
        expect(history[1].id).toBe(firstTest.id);
    });

    it("keeps only the latest 10 tests", () => {
        for (let i = 1; i <= 12; i++) {
            saveTestToHistory({
                ...sampleResults,
                download: i * 1_000_000,
            });
        }

        const history = getTestHistory();

        expect(history).toHaveLength(10);
        expect(history[0].download).toBe(12_000_000);
        expect(history[9].download).toBe(3_000_000);
    });

    it("saves all supported measurement fields", () => {
        const history = saveTestToHistory(sampleResults);
        const savedTest = history[0];

        expect(savedTest).toMatchObject(sampleResults);
        expect(savedTest.id).toBeTypeOf("string");
        expect(savedTest.date).toBeTypeOf("string");
    });

    it("removes saved history from localStorage", () => {
        saveTestToHistory(sampleResults);

        clearTestHistory();

        expect(getTestHistory()).toEqual([]);
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});
