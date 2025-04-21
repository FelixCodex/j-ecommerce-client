import { createContext, useState } from "react";

interface LineLeftSetterProps {
  left: string;
  width: string;
}

interface UtilsContextType {
  lineLeft: LineLeftSetterProps;
  setLineLeftProperties: (props: LineLeftSetterProps) => void;
  isLoading: boolean;
  setIsLoading: (bool: boolean) => void;
}

export const UtilsContext = createContext<UtilsContextType>({
  lineLeft: { left: "", width: "" },
  setLineLeftProperties: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

interface UtilsProviderProps {
  children: import("react").ReactElement;
}

export function UtilsProvider({ children }: UtilsProviderProps) {
  const [lineLeft, setLineLeft] = useState({ left: "0px", width: "43" });
  const [isLoading, setIsLoading] = useState(false);

  const setLineLeftProperties = ({ left, width }: LineLeftSetterProps) => {
    setLineLeft({ left, width });
  };

  return (
    <UtilsContext.Provider
      value={{
        lineLeft,
        setLineLeftProperties,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UtilsContext.Provider>
  );
}
