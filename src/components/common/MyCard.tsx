import React from "react";

interface MyCardProps {
  className: string;
  children: React.ReactNode;
  title?: string;
}

const MyCard = ({ className, children, title }: MyCardProps) => {
  return (
    <div
      className={`rounded-[10px] bg-[var(--modules-background)] p-2 ${className}`}
    >
      {title && <div className="w-full">{title}</div>}
      {children}
    </div>
  );
};

export default MyCard;
