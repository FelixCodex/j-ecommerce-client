import React, { useState, useEffect, MutableRefObject } from 'react';

// Hook para rastrear las importaciones


export const useLazyLoading = (progressBar: MutableRefObject<HTMLDivElement | null>) => {
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
      progressBar.current?.classList.add("prog")
    };

    const stopLoading = () => {
      setLoading(false);
      progressBar.current?.classList.add("finish")
        setTimeout(()=>{
        progressBar.current?.classList.remove("prog")
        progressBar.current?.classList.remove("finish")
      },)
    };

    // Agregar los hooks globales de eventos para el inicio y fin de las importaciones
    const showBarOnStart = () => startLoading();
    const hideBarOnEnd = () => stopLoading();

    // Usamos el evento global de Suspense para detectar las cargas
    React.lazy = (importFn) => {
      return React.lazy(() => {
        showBarOnStart();
        return importFn().finally(hideBarOnEnd);
      });
    };

    return () => {
        progressBar.current?.classList.add("finish")
          setTimeout(()=>{
          progressBar.current?.classList.remove("prog")
          progressBar.current?.classList.remove("finish")
        },)
    };
  }, []);

  return loading;
};