import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function PageSkeleton() {
    return (
        <div className="flex flex-col flex-1 min-h-0 space-y-6 animate-in fade-in duration-300">

            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         
                {/* <Skeleton className="h-10 w-full sm:w-[150px] rounded-md" /> */}
                <div className='flex flex-col gap-2'>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>

                <Skeleton className="h-8 w-48" />
            </div>

            {/* 2. Customer Health KPIs (row) */}
            <div className="flex gap-4 overflow-x-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="flex-1 min-w-0 p-4 space-y-6 border shadow-sm bg-transparent">
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className='flex flex-col gap-2 mt-4'>
                            <Skeleton className="h-3 w-22" />
                            <Skeleton className="h-3 w-28" />
                        </div>

                    </Card>
                ))}
            </div>

            <div className="gap-6">
                <Card className="p-6 space-y-4 w-full bg-transparent">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-[220px] w-full rounded-md" />
                </Card>
            </div>

        </div>
    );
}