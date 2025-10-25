import React from 'react';

const LoadingSkeleton = ({ height = '100px', width = '100%', className = '' }) => {
  return (
    <div
      className={`skeleton rounded ${className}`}
      style={{ height, width }}
    />
  );
};

export default LoadingSkeleton;
