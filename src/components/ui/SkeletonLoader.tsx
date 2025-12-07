export function SkeletonLoader({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
            {/* Image skeleton */}
            <SkeletonLoader className="aspect-square w-full" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <SkeletonLoader className="h-5 w-3/4" />

                {/* Description */}
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-2/3" />

                {/* Price */}
                <SkeletonLoader className="h-6 w-1/3" />

                {/* Button */}
                <SkeletonLoader className="h-10 w-full" />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <SkeletonLoader className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader className="h-6 w-48" />
                        <SkeletonLoader className="h-4 w-64" />
                    </div>
                </div>
            </div>

            {/* Content blocks */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                    <SkeletonLoader className="h-6 w-32 mb-4" />
                    <div className="space-y-2">
                        <SkeletonLoader className="h-4 w-full" />
                        <SkeletonLoader className="h-4 w-5/6" />
                        <SkeletonLoader className="h-4 w-4/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <SkeletonLoader className="h-12 w-full" />
                </div>
            ))}
        </div>
    );
}
