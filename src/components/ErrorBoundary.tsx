import React, { Component, ReactNode } from "react"

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
          <h1>Oops! Something went wrong.</h1>
          <p>{errorMessage || "An unexpected error occurred."}</p>
          <button onClick={this.handleRefresh}>Refresh Page</button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
