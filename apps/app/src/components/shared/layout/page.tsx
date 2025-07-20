import { cn } from '@/lib/utils'

export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('h-full', className)}>{children}</div>
}

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={cn('text-2xl font-bold', className)}>{children}</h1>
}
