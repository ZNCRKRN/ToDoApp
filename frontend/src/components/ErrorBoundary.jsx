import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error, info) {
    console.error("Beklenmeyen hata:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Bir şeyler ters gitti</h2>
          <p>{this.state.message}</p>
          <button onClick={() => window.location.reload()}>Sayfayı yenile</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
