// ========================================
// Configuration
// ========================================

const STORAGE_KEY = "netspeed-test-history";
const MAX_HISTORY = 10;

// ========================================
// 1. Retrieve Saved History
// ========================================

export function getTestHistory() {
    try {
        const savedHistory = localStorage.getItem(STORAGE_KEY);

        if (!savedHistory) {
            return [];
        }

        const history = JSON.parse(savedHistory);

        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.error("Failed to read test history:", error);

        return [];
    }
}

// ========================================
// 2. Save a Completed Test
// ========================================

export function saveTestToHistory(results) {
    const history = getTestHistory();

    const newTest = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),

        download: results.download,
        upload: results.upload,

        latency: results.latency,
        jitter: results.jitter,

        downloadLatency: results.downloadLatency,
        uploadLatency: results.uploadLatency,

        downloadJitter: results.downloadJitter,
        uploadJitter: results.uploadJitter,

        duration: results.duration,
    };

    const updatedHistory = [newTest, ...history].slice(0, MAX_HISTORY);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

        return updatedHistory;
    } catch (error) {
        console.error("Failed to save test history:", error);

        throw error;
    }
}

// ========================================
// 3. Delete All Saved Tests
// ========================================

export function clearTestHistory() {
    localStorage.removeItem(STORAGE_KEY);
}
