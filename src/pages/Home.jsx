import { useEffect, useRef, useState } from "react";

import TestButton from "../components/TestButton";
import SpeedHistoryChart from "../components/SpeedHistoryChart";
import { createSpeedTest } from "../services/speedTest";
import GamingQuality from "../components/GamingQuality.jsx";
import VideoCallQuality from "../components/VideoCallQuality.jsx";
import ConnectionQuality from "../components/ConnectionQuality.jsx";

import {
    getTestHistory,
    saveTestToHistory,
    clearTestHistory,
} from "../utils/testHistory.js";

import { formatSpeed, formatMilliseconds } from "../utils/formatSpeed";

const initialResults = {
    download: null,
    upload: null,
    latency: null,
    jitter: null,
    downloadLatency: null,
    uploadLatency: null,
    downloadJitter: null,
    uploadJitter: null,
    duration: null,
};

const statusMessages = {
    idle: "Ready to test your connection",
    latency: "Measuring latency...",
    download: "Testing download speed...",
    upload: "Testing upload speed...",
    completed: "Test completed successfully",
    error: "The test could not be completed",
};

function Home() {
    // ========================================
    // State
    // ========================================

    const [history, setHistory] = useState(() => getTestHistory());

    const [status, setStatus] = useState("idle");

    const [results, setResults] = useState(() => {
        const savedHistory = getTestHistory();

        if (savedHistory.length === 0) {
            return { ...initialResults };
        }

        const latestTest = savedHistory[0];

        return {
            ...initialResults,
            ...latestTest,
        };
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [progress, setProgress] = useState(0);
    // Refs
    const testRef = useRef(null);
    const mountedRef = useRef(false);

    // Initialization and cleanup
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            testRef.current?.pause();
            testRef.current = null;
        };
    }, []);

    // Business Logic
    function startTest() {
        if (
            testRef.current !== null ||
            status === "latency" ||
            status === "download" ||
            status === "upload"
        ) {
            return;
        }

        setResults({ ...initialResults });
        setErrorMessage("");
        setProgress(0);
        setStatus("latency");

        try {
            const test = createSpeedTest({
                onStatusChange(nextStatus) {
                    if (!mountedRef.current) return;

                    setStatus(nextStatus);
                },

                onProgressChange(nextProgress) {
                    if (!mountedRef.current) return;

                    setProgress(nextProgress);
                },

                onResultsChange(partialResults) {
                    if (!mountedRef.current) return;

                    setResults((current) => ({
                        ...current,

                        latency:
                            partialResults.latency != null
                                ? partialResults.latency
                                : current.latency,

                        jitter:
                            partialResults.jitter != null
                                ? partialResults.jitter
                                : current.jitter,

                        download:
                            partialResults.download != null
                                ? partialResults.download
                                : current.download,

                        upload:
                            partialResults.upload != null
                                ? partialResults.upload
                                : current.upload,
                    }));
                },

                onFinish(finalResults) {
                    if (!mountedRef.current) return;

                    const completedResults = {
                        download: finalResults.download,
                        upload: finalResults.upload,
                        latency: finalResults.latency,
                        jitter: finalResults.jitter,
                        downloadLatency: finalResults.downloadLatency,
                        uploadLatency: finalResults.uploadLatency,
                        downloadJitter: finalResults.downloadJitter,
                        uploadJitter: finalResults.uploadJitter,
                        duration: finalResults.duration,
                    };

                    setResults(completedResults);

                    try {
                        const updatedHistory =
                            saveTestToHistory(completedResults);
                        setHistory(updatedHistory);
                    } catch (error) {
                        console.error("Could not save test history:", error);
                    }

                    setProgress(100);
                    setStatus("completed");
                    testRef.current = null;
                },

                onError(error) {
                    if (!mountedRef.current) return;

                    setErrorMessage(error);
                    setStatus("error");
                    testRef.current?.pause();
                    testRef.current = null;
                },
            });

            testRef.current = test;
            test.start();
        } catch (error) {
            testRef.current?.pause();
            testRef.current = null;
            setErrorMessage(
                error instanceof Error ? error.message : "Unknown error",
            );
            setStatus("error");
        }
    }

    // Helper Functions
    const isRunning = ["latency", "download", "upload"].includes(status);

    const canStart = !isRunning;

    return (
        <main className="app">
            <header className="app-header">
                <h1>NetSpeed</h1>
                <p>Internet Speed Test</p>
            </header>

            <section className="test-panel">
                <p className="status" aria-live="polite">
                    {statusMessages[status]}
                </p>

                <div className="gauge">
                    <span>
                        {results.download == null
                            ? "--"
                            : formatSpeed(results.download)}
                    </span>

                    <small>Mbps Download</small>
                </div>

                <TestButton status={status} onStart={startTest} />

                {isRunning && (
                    <p className="test-hint">
                        The test is running. Please wait...
                    </p>
                )}

                <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Test progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}>
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {errorMessage && (
                    <div className="error-message" role="alert">
                        <p>Test failed</p>
                        <small>{errorMessage}</small>
                    </div>
                )}

                <div className="results-grid">
                    <article className="result-card">
                        <span>↓ Download</span>
                        <strong>{formatSpeed(results.download)} Mbps</strong>
                    </article>

                    <article className="result-card">
                        <span>↑ Upload</span>
                        <strong>{formatSpeed(results.upload)} Mbps</strong>
                    </article>

                    <article className="result-card">
                        <span>⚡ Latency</span>
                        <strong>
                            {formatMilliseconds(results.latency)} ms
                        </strong>
                    </article>

                    <article className="result-card">
                        <span>〰 Jitter</span>
                        <strong>{formatMilliseconds(results.jitter)} ms</strong>
                    </article>
                </div>

                {status === "completed" && (
                    <section className="advanced-results">
                        <h2>Advanced Results</h2>

                        <p>
                            Download latency:{" "}
                            {formatMilliseconds(results.downloadLatency)} ms
                        </p>

                        <p>
                            Upload latency:{" "}
                            {formatMilliseconds(results.uploadLatency)} ms
                        </p>

                        <p>
                            Download jitter:{" "}
                            {formatMilliseconds(results.downloadJitter)} ms
                        </p>

                        <p>
                            Upload jitter:{" "}
                            {formatMilliseconds(results.uploadJitter)} ms
                        </p>

                        <p>
                            Test duration:{" "}
                            {results.duration == null
                                ? "--"
                                : (results.duration / 1000).toFixed(1)}{" "}
                            seconds
                        </p>
                    </section>
                )}

                <p className="notice">
                    Measurements are performed through Cloudflare's network.
                    Results may vary depending on network conditions and the
                    selected test infrastructure.
                </p>

                {canStart && status !== "idle" && (
                    <button className="secondary-button" onClick={startTest}>
                        Test Again
                    </button>
                )}
            </section>

            {results.download != null &&
                results.upload != null &&
                results.latency != null &&
                results.jitter != null && (
                    <>
                        <ConnectionQuality results={results} />

                        <GamingQuality results={results} />

                        <VideoCallQuality results={results} />
                    </>
                )}

            <SpeedHistoryChart history={history} />
            <section className="history-panel">
                <div className="history-header">
                    <h2>Test History</h2>

                    {history.length > 0 && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                try {
                                    clearTestHistory();

                                    setHistory([]);
                                    setResults({ ...initialResults });
                                } catch (error) {
                                    console.error(
                                        "Could not clear test history:",
                                        error,
                                    );
                                }
                            }}>
                            Clear History
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <p className="history-empty">
                        No previous tests yet. Run your first test!
                    </p>
                ) : (
                    <div className="history-list">
                        {history.map((test) => (
                            <article className="history-item" key={test.id}>
                                <time dateTime={test.date}>
                                    {new Date(test.date).toLocaleString()}
                                </time>

                                <div className="history-results">
                                    <span>
                                        ↓ Download: {formatSpeed(test.download)}{" "}
                                        Mbps
                                    </span>

                                    <span>
                                        ↑ Upload: {formatSpeed(test.upload)}{" "}
                                        Mbps
                                    </span>

                                    <span>
                                        ⚡ Latency:{" "}
                                        {formatMilliseconds(test.latency)} ms
                                    </span>

                                    <span>
                                        〰 Jitter:{" "}
                                        {formatMilliseconds(test.jitter)} ms
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;
