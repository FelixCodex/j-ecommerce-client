import React, { useEffect } from 'react';

export const LoadingWrapper = ({ children, onMount }: { children: React.ReactNode; onMount?: () => void }) => {
  useEffect(() => {
    if (onMount) {
      onMount(); // Ejecutar la función pasada cuando el componente se monta
    }
  }, [onMount]);

  return <>{children}</>;
};