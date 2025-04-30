import React from "react";

const LoadingDots = ({
  loading,
  content,
  className,
}: {
  loading: boolean;
  content: React.ReactNode;
  className?: string;
}) => {
  return <>{loading ? <div className={`dot-flashing mr-3 ${className ?? ""}`}></div> : content}</>;
};

export default LoadingDots;
