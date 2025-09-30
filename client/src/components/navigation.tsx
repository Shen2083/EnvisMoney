import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Envis</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
              data-testid="link-how-it-works"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
              data-testid="link-benefits"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md"
              data-testid="link-faq"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("waitlist")}
              data-testid="button-join-waitlist-nav"
            >
              Join Waiting List
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
