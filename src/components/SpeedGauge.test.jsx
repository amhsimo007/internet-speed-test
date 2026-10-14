// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import SpeedGauge from "./SpeedGauge.jsx";

afterEach(() => {
    cleanup();
});

describe("SpeedGauge component", () => {
    it("displays the default title and placeholder", () => {
        render(<SpeedGauge />);

        expect(
            screen.getByRole("heading", {
                name: "Download Speed",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("--")).toBeInTheDocument();

        expect(screen.getByText("Mbps")).toBeInTheDocument();
    });

    it("displays a valid speed with two decimal places", () => {
        render(<SpeedGauge speed={125.756} />);

        expect(screen.getByText("125.76")).toBeInTheDocument();
    });

    it("displays zero as a valid speed", () => {
        render(<SpeedGauge speed={0} />);

        expect(screen.getByText("0.00")).toBeInTheDocument();
    });

    it("displays a custom title and unit", () => {
        render(<SpeedGauge title="Upload Speed" speed={50} unit="Mbps" />);

        expect(
            screen.getByRole("heading", {
                name: "Upload Speed",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("50.00")).toBeInTheDocument();
    });

    it.each([-10, NaN, Infinity, -Infinity, null, undefined])(
        "displays a placeholder for invalid speed: %s",
        (speed) => {
            render(<SpeedGauge speed={speed} />);

            expect(screen.getByText("--")).toBeInTheDocument();
        },
    );

    it("renders an accessible meter", () => {
        render(<SpeedGauge title="Download Speed" speed={250} />);

        const meter = screen.getByRole("meter", {
            name: "Download Speed",
        });

        expect(meter).toBeInTheDocument();
        expect(meter).toHaveAttribute("aria-valuemin", "0");
        expect(meter).toHaveAttribute("aria-valuemax", "1000");
        expect(meter).toHaveAttribute("aria-valuenow", "250");
    });

    it("limits the visual gauge percentage to 100%", () => {
        render(<SpeedGauge speed={1500} />);

        const meter = screen.getByRole("meter", {
            name: "Download Speed",
        });

        expect(meter).toHaveStyle({
            "--gauge-percentage": "100%",
        });

        expect(screen.getByText("1500.00")).toBeInTheDocument();
    });
});
