import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavigationVisibilityContextType {
  isNavigationVisible: boolean;
  hideNavigation: () => void;
  showNavigation: () => void;
}

const NavigationVisibilityContext = createContext<
  NavigationVisibilityContextType | undefined
>(undefined);

export const NavigationVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);

  const hideNavigation = () => setIsNavigationVisible(false);
  const showNavigation = () => setIsNavigationVisible(true);

  return (
    <NavigationVisibilityContext.Provider
      value={{
        isNavigationVisible,
        hideNavigation,
        showNavigation,
      }}
    >
      {children}
    </NavigationVisibilityContext.Provider>
  );
};

export const useNavigationVisibility = () => {
  const context = useContext(NavigationVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationVisibility must be used within a NavigationVisibilityProvider"
    );
  }
  return context;
};
