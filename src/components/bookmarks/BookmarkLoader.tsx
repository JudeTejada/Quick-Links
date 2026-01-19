import { Skeleton } from '@/components/ui/skeleton';

export function BookmarkLoader() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-3 w-48 rounded-md" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-3 w-48 rounded-md" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
