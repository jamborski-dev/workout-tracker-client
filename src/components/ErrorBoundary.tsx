import React, { Component, ReactNode } from "react"
import i18n from "@root/i18n"

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage?: string
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, errorMessage: "" }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  handleRefresh = () => {
    this.setState({ hasError: false, errorMessage: "" })
    window.location.reload()
  }

  render() {
    const { hasError, errorMessage } = this.state

    if (hasError) {
      return (
        <div id="error-boundary">
          <h1>{i18n.t("error.oops")}</h1>
          <p>{errorMessage || i18n.t("error.unexpected")}</p>
          <button type="button" onClick={this.handleRefresh}>
            {i18n.t("error.refresh")}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
