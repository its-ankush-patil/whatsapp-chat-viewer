import { Component } from 'react'

/**
 * Resilient Error Boundary that catches rendering or parsing exceptions
 * inside the chat or viewer components, preventing a complete UI crash.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto my-8 max-w-xl rounded-2xl border border-red-500/30 bg-[#1c1313] p-6 text-center text-red-200 shadow-2xl backdrop-blur-xl"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-2xl text-red-400">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-white">Something went wrong while rendering this chat</h2>
          <p className="mt-2 text-sm text-red-200/80">
            An unexpected error occurred while processing message content or media. The system prevented an application
            crash.
          </p>
          {this.state.error && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-black/50 p-3 text-left font-mono text-xs text-red-300">
              {this.state.error.message || String(this.state.error)}
            </pre>
          )}
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-full bg-red-500/20 px-5 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30 active:scale-95"
            >
              Recover & Reset View
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
