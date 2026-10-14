import SpeedTest from "@cloudflare/speedtest";

export function createSpeedTest({
    onStatusChange,
    onResultsChange,
    onProgressChange,
    onFinish,
    onError,
}) {
    const engine = new SpeedTest({
        autoStart: false,

        measureDownloadLoadedLatency: true,
        measureUploadLoadedLatency: true,

        measurements: [
            { type: "latency", numPackets: 1 },
            {
                type: "download",
                bytes: 100000,
                count: 1,
                bypassMinDuration: true,
            },
            { type: "latency", numPackets: 20 },
            { type: "download", bytes: 100000, count: 9 },
            { type: "download", bytes: 1000000, count: 8 },
            { type: "upload", bytes: 100000, count: 8 },
            { type: "upload", bytes: 1000000, count: 6 },
            { type: "download", bytes: 10000000, count: 6 },
            { type: "upload", bytes: 10000000, count: 4 },
        ],
    });

    engine.onRunningChange = (running) => {
        if (running) {
            onStatusChange?.("latency");
        }
    };

    engine.onPhaseChange = ({ measurementId }) => {
        const totalMeasurements = 9;

        const progress = Math.round(
            ((measurementId + 1) / totalMeasurements) * 100,
        );

        onProgressChange?.(Math.min(progress, 99));
    };

    engine.onResultsChange = ({ type }) => {
        if (type === "latency") {
            onStatusChange?.("latency");
        } else if (type === "download") {
            onStatusChange?.("download");
        } else if (type === "upload") {
            onStatusChange?.("upload");
        }

        const results = engine.results;

        onResultsChange?.({
            latency: results.getUnloadedLatency(),
            jitter: results.getUnloadedJitter(),
            download: results.getDownloadBandwidth(),
            upload: results.getUploadBandwidth(),
        });
    };

    engine.onFinish = (results) => {
        const summary = results.getSummary();

        onFinish?.({
            summary,
            latency: results.getUnloadedLatency(),
            jitter: results.getUnloadedJitter(),
            download: results.getDownloadBandwidth(),
            upload: results.getUploadBandwidth(),
            downloadLatency: results.getDownLoadedLatency(),
            uploadLatency: results.getUpLoadedLatency(),
            downloadJitter: results.getDownLoadedJitter(),
            uploadJitter: results.getUpLoadedJitter(),
            duration: results.getTotalDurationMs(),
        });
    };

    engine.onError = (error) => {
        onError?.(String(error));
    };

    return {
        start() {
            engine.play();
        },

        pause() {
            engine.pause();
        },

        get isRunning() {
            return engine.isRunning;
        },
    };
}
