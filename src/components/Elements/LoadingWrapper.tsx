import React, { useEffect } from 'react';

export const LoadingWrapper = ({ children, onMount }: { children: React.ReactNode; onMount?: () => void }) => {
  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

  return <>{children}</>;
};