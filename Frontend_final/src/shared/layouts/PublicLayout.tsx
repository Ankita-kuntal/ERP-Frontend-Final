import React from 'react';
import { DarkModeToggle } from './DarkModeToggle'

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    // Container with background and text color support for light and dark mode
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Position the DarkModeToggle button at the bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      {/* Center the children content both vertically and horizontally */}
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};
