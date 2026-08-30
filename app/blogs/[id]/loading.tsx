const Loading = () => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-lg border bg-card p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="flex gap-2 mt-2">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
