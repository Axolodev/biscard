import LogRocket from "logrocket";
import { useTranslations } from "next-intl";
import * as React from "react";

import useFormStateStore from "@/store/formStateStore";

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Shown in place of the 3d scene after it crashed. Resets every form field to
 * its default (the usual cause of the crash is an invalid value) and then
 * asks the boundary to try rendering the scene again.
 */
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("visualizer");
  const resetValues = useFormStateStore((s) => s.resetValues);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[80%] text-center flex flex-col items-center justify-center gap-4">
        <p className="text-xl">{t("error")}</p>
        <button
          type="button"
          className="ml-4 btn btn-primary"
          onClick={() => {
            resetValues();
            onRetry();
          }}
        >
          {t("errorCTA")}
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    LogRocket.captureException(error, {
      extra: { componentStack: info.componentStack ?? "" },
    });
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.retry} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
