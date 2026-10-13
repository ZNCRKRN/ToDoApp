function LoadingSpinner({ label = "Yükleniyor..." }) {
  return (
    <div className="loading-spinner-wrap" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
