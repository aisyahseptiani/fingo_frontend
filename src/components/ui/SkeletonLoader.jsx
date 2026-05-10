export default function SkeletonLoader({ className = '' }) {
  return <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 space-y-3 ${className}`}>
      <SkeletonLoader className="h-4 w-1/3" />
      <SkeletonLoader className="h-7 w-2/3" />
      <SkeletonLoader className="h-3 w-full" />
      <SkeletonLoader className="h-3 w-4/5" />
    </div>
  )
}