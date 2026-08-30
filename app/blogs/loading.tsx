const Loading = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-8 w-24 bg-muted rounded animate-pulse mb-6" />

      <div className="h-10 w-72 bg-muted rounded animate-pulse mb-8" />

      <ul className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="rounded-lg border bg-card p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-56 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="flex gap-2 mt-1">
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loading;