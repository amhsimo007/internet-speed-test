import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    engine: null,
    constructorOptions: null,
}));

vi.mock("@cloudflare/speedtest", () => ({
    default: class MockSpeedTest {
        constructor(options) {
            mocks.constructorOptions = options;
            mocks.engine = this;

            this.isRunning = false;
            this.results = {
                getUnloadedLatency: vi.fn(() => 20),
                getUnloadedJitter: vi.fn(() => 3),
                getDownloadBandwidth: vi.fn(() => 50_000_000),
                getUploadBandwidth: vi.fn(() => 10_000_000),
            };
        }

        play = vi.fn(() => {
            this.isRunning = true;
        });

        pause = vi.fn(() => {
            this.isRunning = false;
        });
    },
}));

import { createSpeedTest } from "./speedTest.js";

describe("speedTest service", () => {
    let callbacks;

    beforeEach(() => {
        callbacks = {
            onStatusChange: vi.fn(),
            onResultsChange: vi.fn(),
            onFinish: vi.fn(),
            onError: vi.fn(),
        };

        mocks.engine = null;
        mocks.constructorOptions = null;
    });

    it("should create the engine without starting it automatically", () => {
        createSpeedTest(callbacks);

        expect(mocks.constructorOptions.autoStart).toBe(false);
        expect(mocks.engine.play).not.toHaveBeenCalled();
    });

    it("should start and pause the engine", () => {
        const test = createSpeedTest(callbacks);

        test.start();

        expect(mocks.engine.play).toHaveBeenCalledOnce();
        expect(test.isRunning).toBe(true);

        test.pause();

        expect(mocks.engine.pause).toHaveBeenCalledOnce();
        expect(test.isRunning).toBe(false);
    });

    it("should report the current measurement status and results", () => {
        createSpeedTest(callbacks);

        mocks.engine.onResultsChange({ type: "download" });

        expect(callbacks.onStatusChange).toHaveBeenCalledWith("download");

        expect(callbacks.onResultsChange).toHaveBeenCalledWith({
            latency: 20,
            jitter: 3,
            download: 50_000_000,
            upload: 10_000_000,
        });
    });

    it("should pass the final measurements to onFinish", () => {
        createSpeedTest(callbacks);

        const finalResults = {
            getSummary: () => ({
                download: 50_000_000,
                upload: 10_000_000,
            }),
            getUnloadedLatency: () => 20,
            getUnloadedJitter: () => 3,
            getDownloadBandwidth: () => 50_000_000,
            getUploadBandwidth: () => 10_000_000,
            getDownLoadedLatency: () => 40,
            getUpLoadedLatency: () => 35,
            getDownLoadedJitter: () => 5,
            getUpLoadedJitter: () => 4,
            getTotalDurationMs: () => 12_000,
        };

        mocks.engine.onFinish(finalResults);

        expect(callbacks.onFinish).toHaveBeenCalledWith({
            summary: {
                download: 50_000_000,
                upload: 10_000_000,
            },
            latency: 20,
            jitter: 3,
            download: 50_000_000,
            upload: 10_000_000,
            downloadLatency: 40,
            uploadLatency: 35,
            downloadJitter: 5,
            uploadJitter: 4,
            duration: 12_000,
        });
    });

    it("should report progress when a measurement phase changes", () => {
        const onProgressChange = vi.fn();

        createSpeedTest({
            ...callbacks,
            onProgressChange,
        });

        mocks.engine.onPhaseChange({
            measurementId: 3,
            measurement: { type: "download" },
        });

        expect(onProgressChange).toHaveBeenCalledWith(44);
    });

    it("should forward errors to onError", () => {
        createSpeedTest(callbacks);

        mocks.engine.onError("Network connection failed", 503);

        expect(callbacks.onError).toHaveBeenCalledWith(
            "Network connection failed",
        );
    });
});
