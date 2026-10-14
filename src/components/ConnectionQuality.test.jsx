// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ConnectionQuality from "./ConnectionQuality.jsx";

afterEach(() => {
    cleanup();
});

describe("ConnectionQuality component", () => {
    it("displays a message when results are unavailable", () => {
        render(<ConnectionQuality results={{}} />);

        expect(
            screen.getByRole("heading", {
                name: "Connection Quality",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Complete a speed test to evaluate your connection quality.",
            ),
        ).toBeInTheDocument();
    });

    it("displays an excellent rating for excellent results", () => {
        render(
            <ConnectionQuality
                results={{
                    download: 100_000_000,
                    upload: 30_000_000,
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(
            screen.getByText("Your connection is performing very well."),
        ).toBeInTheDocument();

        const panel = screen
            .getByRole("heading", {
                name: "Connection Quality",
            })
            .closest("section");

        expect(panel).toHaveClass("quality-excellent");

        expect(within(panel).getByText("100.00 Mbps")).toBeInTheDocument();

        expect(within(panel).getByText("30.00 Mbps")).toBeInTheDocument();

        expect(within(panel).getByText("15.0 ms")).toBeInTheDocument();

        expect(within(panel).getByText("3.0 ms")).toBeInTheDocument();
    });

    it("displays the correct metric labels", () => {
        render(
            <ConnectionQuality
                results={{
                    download: 100_000_000,
                    upload: 30_000_000,
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(screen.getByText("Download Speed")).toBeInTheDocument();
        expect(screen.getByText("Upload Speed")).toBeInTheDocument();
        expect(screen.getByText("Latency")).toBeInTheDocument();
        expect(screen.getByText("Jitter")).toBeInTheDocument();
    });

    it("displays a poor rating for poor results", () => {
        render(
            <ConnectionQuality
                results={{
                    download: 5_000_000,
                    upload: 1_000_000,
                    latency: 150,
                    jitter: 40,
                }}
            />,
        );

        const panel = screen
            .getByRole("heading", {
                name: "Connection Quality",
            })
            .closest("section");

        expect(panel).toHaveClass("quality-poor");

        expect(
            within(panel).getByText("Your connection may need improvement."),
        ).toBeInTheDocument();
    });

    it("does not display an evaluation when results are invalid", () => {
        render(
            <ConnectionQuality
                results={{
                    download: NaN,
                    upload: 30_000_000,
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(
            screen.getByText(
                "Complete a speed test to evaluate your connection quality.",
            ),
        ).toBeInTheDocument();
    });

    it("displays the explanation of the quality rating", () => {
        render(
            <ConnectionQuality
                results={{
                    download: 100_000_000,
                    upload: 30_000_000,
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(
            screen.getByText(/This rating is an estimate/),
        ).toBeInTheDocument();
    });
});
