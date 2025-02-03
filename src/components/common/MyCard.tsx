import React from "react";

interface MyCardProps {
  className: string;
  children: React.ReactNode;
  title?: string;
}

const MyCard = ({ className, children, title }: MyCardProps) => {
  return (
    <div
      className={`rounded-[10px] bg-[var(--modules-background)] p-2 overflow-hidden ${className}`}
    >
      {title && <div className="w-full h-8">{title}</div>}
      {children}
    </div>
  );
};

export default MyCard;
