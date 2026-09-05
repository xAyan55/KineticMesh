import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface PageContentBlockProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, className, children }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | KineticMesh`;
    }
  }, [title]);

  return (
    <div className="w-full px-4 py-4 sm:py-6 mx-auto max-w-[1240px] kx-stagger">
      <div className={cn("min-h-[calc(100vh-180px)]", className)}>
        {children}
      </div>
      <footer className="mt-12 mb-6 text-center text-xs text-neutral-400 border-t border-gray-700/60 pt-6">
        <p className="font-medium text-gray-300">KineticMesh Control Plane</p>
        <p className="text-gray-400 mt-1">KineticHost - You Dream, We Host. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default PageContentBlock;
