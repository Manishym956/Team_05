const LoadingSkeleton = ({ className = '' }) => {
  return (
    <div className={`skeleton ${className} bg-gray-200 dark:bg-gray-700 rounded-lg`} />
  );
};

export default LoadingSkeleton;

