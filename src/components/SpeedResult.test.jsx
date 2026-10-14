// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import SpeedResult from "./SpeedResult.jsx";

afterEach(() => {
    cleanup();
});

describe("SpeedResult component", () => {
    it("renders the results section and all four metric labels", () => {
        render(<SpeedResult />);

        expect(
            screen.getByRole("heading", {
                name: "Test Results",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Download",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Upload",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Latency",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Jitter",
            }),
        ).toBeInTheDocument();
    });

    it("displays all values with two decimal places", () => {
        render(
            <SpeedResult
                results={{
                    download: 125.756,
                    upload: 24.5,
                    latency: 18.256,
                    jitter: 2.1,
                }}
            />,
        );

        expect(screen.getByText("125.76")).toBeInTheDocument();
        expect(screen.getByText("24.50")).toBeInTheDocument();
        expect(screen.getByText("18.26")).toBeInTheDocument();
        expect(screen.getByText("2.10")).toBeInTheDocument();
    });

    it("displays placeholders when results are missing", () => {
        render(<SpeedResult />);

        expect(screen.getAllByText("--")).toHaveLength(4);
    });

    it("displays placeholders for invalid values", () => {
        render(
            <SpeedResult
                results={{
                    download: NaN,
                    upload: -10,
                    latency: Infinity,
                    jitter: null,
                }}
            />,
        );

        expect(screen.getAllByText("--")).toHaveLength(4);
    });

    it("displays zero as a valid result", () => {
        render(
            <SpeedResult
                results={{
                    download: 0,
                    upload: 0,
                    latency: 0,
                    jitter: 0,
                }}
            />,
        );

        expect(screen.getAllByText("0.00")).toHaveLength(4);
    });

    it("displays the correct units for download, upload, latency, and jitter", () => {
        render(
            <SpeedResult
                results={{
                    download: 100,
                    upload: 20,
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        const downloadCard = screen.getByRole("article", {
            name: "Download speed",
        });

        const uploadCard = screen.getByRole("article", {
            name: "Upload speed",
        });

        const latencyCard = screen.getByRole("article", {
            name: "Connection response time",
        });

        const jitterCard = screen.getByRole("article", {
            name: "Variation in response time",
        });

        expect(within(downloadCard).getByText("Mbps")).toBeInTheDocument();

        expect(within(uploadCard).getByText("Mbps")).toBeInTheDocument();

        expect(within(latencyCard).getByText("ms")).toBeInTheDocument();

        expect(within(jitterCard).getByText("ms")).toBeInTheDocument();
    });
});
