// @vitest-environment jsdom

import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import TestButton from "./TestButton.jsx";

// ========================================
// Cleanup
// ========================================

afterEach(() => {
    cleanup();
});

// ========================================
// TestButton Component Tests
// ========================================

describe("TestButton component", () => {
    it("displays Start Test when the test is idle", () => {
        render(<TestButton status="idle" onStart={vi.fn()} />);

        const button = screen.getByRole("button", {
            name: "Start Test",
        });

        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
    });

    it.each(["latency", "download", "upload"])(
        "displays Testing and disables the button when status is %s",
        (status) => {
            render(<TestButton status={status} onStart={vi.fn()} />);

            const button = screen.getByRole("button", {
                name: "Testing...",
            });

            expect(button).toBeInTheDocument();
            expect(button).toBeDisabled();
        },
    );

    it("calls onStart when the button is clicked", async () => {
        const user = userEvent.setup();
        const onStart = vi.fn();

        render(<TestButton status="idle" onStart={onStart} />);

        await user.click(
            screen.getByRole("button", {
                name: "Start Test",
            }),
        );

        expect(onStart).toHaveBeenCalledTimes(1);
    });

    it("does not call onStart when the button is disabled", async () => {
        const user = userEvent.setup();
        const onStart = vi.fn();

        render(<TestButton status="download" onStart={onStart} />);

        await user.click(
            screen.getByRole("button", {
                name: "Testing...",
            }),
        );

        expect(onStart).not.toHaveBeenCalled();
    });

    it("enables the button after the test is completed", () => {
        render(<TestButton status="completed" onStart={vi.fn()} />);

        const button = screen.getByRole("button", {
            name: "Start Test",
        });

        expect(button).toBeEnabled();
    });

    it("enables the button when the test has an error", () => {
        render(<TestButton status="error" onStart={vi.fn()} />);

        const button = screen.getByRole("button", {
            name: "Start Test",
        });

        expect(button).toBeEnabled();
    });
});
