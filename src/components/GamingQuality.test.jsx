// @vitest-environment jsdom

import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import GamingQuality from "./GamingQuality.jsx";

afterEach(() => {
    cleanup();
});

// ========================================
// 1. Initial State
// ========================================

describe("GamingQuality - Initial State", () => {
    it("should display a message when results are incomplete", () => {
        render(
            <GamingQuality
                results={{
                    latency: null,
                    jitter: null,
                }}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: /gaming quality/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /complete a speed test to evaluate your connection for gaming/i,
            ),
        ).toBeInTheDocument();
    });

    it("should display the initial state when results are missing", () => {
        render(<GamingQuality results={{}} />);

        expect(
            screen.getByText(
                /complete a speed test to evaluate your connection for gaming/i,
            ),
        ).toBeInTheDocument();
    });
});

// ========================================
// 2. Excellent Gaming Quality
// ========================================

describe("GamingQuality - Excellent", () => {
    it("should display excellent quality for low latency and jitter", () => {
        render(
            <GamingQuality
                results={{
                    latency: 10,
                    jitter: 2,
                }}
            />,
        );

        expect(
            screen.getByText(
                "Your connection looks suitable for competitive gaming.",
            ),
        ).toBeInTheDocument();

        expect(screen.getAllByText("Excellent")).toHaveLength(3);

        expect(screen.getByText("10.0 ms")).toBeInTheDocument();

        expect(screen.getByText("2.0 ms")).toBeInTheDocument();
    });

    it("should apply the excellent CSS class", () => {
        const { container } = render(
            <GamingQuality
                results={{
                    latency: 10,
                    jitter: 2,
                }}
            />,
        );

        expect(
            container.querySelector(".gaming-excellent"),
        ).toBeInTheDocument();
    });
});

// ========================================
// 3. Poor Gaming Quality
// ========================================

describe("GamingQuality - Poor", () => {
    it("should use the weaker metric for the overall rating", () => {
        render(
            <GamingQuality
                results={{
                    latency: 10,
                    jitter: 40,
                }}
            />,
        );

        expect(
            screen.getByText(
                "Your connection may cause noticeable gaming delays.",
            ),
        ).toBeInTheDocument();

        expect(screen.getAllByText("Poor")).toHaveLength(2);

        expect(screen.getByText("Excellent")).toBeInTheDocument();

        expect(screen.getByText("10.0 ms")).toBeInTheDocument();

        expect(screen.getByText("40.0 ms")).toBeInTheDocument();
    });

    it("should apply the poor CSS class", () => {
        const { container } = render(
            <GamingQuality
                results={{
                    latency: 10,
                    jitter: 40,
                }}
            />,
        );

        expect(container.querySelector(".gaming-poor")).toBeInTheDocument();
    });
});

// ========================================
// 4. Gaming Improvement Tips
// ========================================

describe("GamingQuality - Tips", () => {
    it("should display all connection improvement tips", () => {
        render(
            <GamingQuality
                results={{
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(
            screen.getByRole("heading", {
                name: /how to improve your gaming connection/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/use ethernet when possible/i),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/choose a game server close to your location/i),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/pause downloads while playing/i),
        ).toBeInTheDocument();

        expect(
            screen.getByText(/avoid network congestion when possible/i),
        ).toBeInTheDocument();
    });

    it("should display the gaming quality disclaimer", () => {
        render(
            <GamingQuality
                results={{
                    latency: 15,
                    jitter: 3,
                }}
            />,
        );

        expect(
            screen.getByText(/actual in-game performance may differ/i),
        ).toBeInTheDocument();
    });
});
