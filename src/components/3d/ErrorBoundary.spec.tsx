import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { renderWithIntl } from "@/i18n/testUtils";
import useFormStateStore from "@/store/formStateStore";
import { initialCardFormState } from "@/components/cardFormTypes";
import ErrorBoundary from "./ErrorBoundary";

vi.mock("logrocket", () => ({ default: { captureException: vi.fn() } }));

/** Throws while the form's card width is invalid, like a bad value would. */
function Scene() {
  const width = useFormStateStore((s) => s.form.card.width);
  if (width < 0) throw new Error("invalid width");
  return <div data-testid="scene" />;
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    useFormStateStore.setState({ form: initialCardFormState });
    vi.restoreAllMocks();
  });

  it("renders its children while nothing fails", () => {
    renderWithIntl(
      <ErrorBoundary>
        <Scene />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("scene")).toBeInTheDocument();
  });

  it("shows the fallback, and its button resets the fields and renders the children again", () => {
    // React logs caught render errors; keep the test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
    useFormStateStore.setState({
      form: {
        ...initialCardFormState,
        card: { ...initialCardFormState.card, width: -1 },
      },
    });
    renderWithIntl(
      <ErrorBoundary>
        <Scene />
      </ErrorBoundary>,
    );

    expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset all fields" }));

    expect(useFormStateStore.getState().form).toEqual(initialCardFormState);
    expect(screen.getByTestId("scene")).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument();
  });
});
