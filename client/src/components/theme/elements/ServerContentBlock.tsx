import React from "react";
import PageContentBlock, { PageContentBlockProps } from "./PageContentBlock";

interface Props extends PageContentBlockProps {
  title: string;
  vmName?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ServerContentBlock: React.FC<Props> = ({ title, vmName, icon: Icon, children, ...props }) => {
  return (
    <PageContentBlock title={vmName ? `${vmName} | ${title}` : title} {...props}>
      {Icon && (
        <div className="flex items-center gap-x-3 mb-6">
          <div className="w-10 h-10 rounded-component border border-gray-600 flex items-center justify-center text-arix backdrop bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-medium text-gray-100 font-header">{title}</h2>
        </div>
      )}
      {children}
    </PageContentBlock>
  );
};

export default ServerContentBlock;
