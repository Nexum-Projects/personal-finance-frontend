export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-pulse rounded-lg border border-border bg-card p-8">
        <div className="mx-auto h-24 w-48 rounded-lg bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-10 rounded-md bg-muted" />
          <div className="h-10 rounded-md bg-muted" />
          <div className="h-11 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}
