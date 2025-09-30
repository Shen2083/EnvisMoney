import { Logo } from '../logo'

export default function LogoExample() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Default size:</p>
        <Logo />
      </div>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Large size:</p>
        <Logo className="h-12 w-auto" />
      </div>
      <div className="space-y-4 bg-card p-6 rounded-lg">
        <p className="text-sm text-muted-foreground">On card background:</p>
        <Logo />
      </div>
      <div className="space-y-4 bg-primary p-6 rounded-lg">
        <p className="text-sm text-muted-foreground text-primary-foreground">On primary background:</p>
        <div className="text-primary-foreground">
          <Logo />
        </div>
      </div>
    </div>
  )
}
