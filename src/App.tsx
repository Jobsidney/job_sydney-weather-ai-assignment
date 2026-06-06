import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function App() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary">Weather-AI</Badge>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Sydney Weather Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Tailwind v4 + shadcn/ui ready for development
            </p>
          </div>
          <Button variant="outline" disabled>
            Refresh
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current conditions</CardTitle>
              <CardDescription>Placeholder shell</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI summary</CardTitle>
              <CardDescription>Gemini insights will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App
