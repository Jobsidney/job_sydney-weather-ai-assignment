import { ExternalLink, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type UpgradePromptProps = {
  title: string
  description: string
  upgradeUrl?: string
  plan?: string
}

export function UpgradePrompt({
  title,
  description,
  upgradeUrl = 'https://app.weather-ai.co/billing',
  plan = 'free',
}: UpgradePromptProps) {
  return (
    <Alert className="border-dashed">
      <Lock strokeWidth={1.75} />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>{description}</p>
        <p className="text-xs uppercase tracking-wide">
          Current plan: {plan}
        </p>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <a href={upgradeUrl} target="_blank" rel="noreferrer">
            Upgrade to Pro
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
