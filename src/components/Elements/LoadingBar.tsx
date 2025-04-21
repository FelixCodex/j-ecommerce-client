import { useState, useEffect } from "react";

const LoadingBar = ({ isLoading }: { isLoading: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Finalizar la barra de carga cuando se complete
    if (isLoading) {
      setProgress(39);
    } else {
      setProgress(99);
      setTimeout(() => {
        setProgress(100); // Reinicia después de un corto retraso
      }, 200);
      setTimeout(() => {
        setProgress(0); // Reinicia después de un corto retraso
      }, 500);
    }
  }, [isLoading]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "4px",
        backgroundColor: "var(--brand_color)",
        transition: "width 0.5s ease, opacity 0.4s",
        opacity: progress > 0 && progress < 100 ? 1 : 0,
        zIndex: 1000,
      }}
    />
  );
};

export default LoadingBar;
