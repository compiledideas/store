import { Toaster, toast } from 'sonner'

export { toast }

/**
 * App-themed sonner toaster. Mounted once in the root shell.
 * Uses brand tokens, no gradients.
 */
export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors={false}
      closeButton
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            'rounded-xl border border-border bg-card text-foreground shadow-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          closeButton: 'text-muted-foreground hover:bg-accent',
        },
      }}
    />
  )
}
