import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-4">Ups! Algo salió mal.</h2>
          <p className="text-on-surface-variant mb-6">
            Ha ocurrido un error inesperado en este módulo. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
