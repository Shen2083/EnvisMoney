import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { Link } from "wouter";

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
          <Logo />

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="sm:hidden" data-testid="button-preorder-nav-mobile">
                Pre-order
              </Button>
              <Button variant="outline" className="hidden sm:inline-flex" data-testid="button-preorder-nav">
                Pre-order
              </Button>
            </Link>
            <Button
              size="sm"
              className="sm:hidden"
              onClick={() => scrollToSection("waitlist")}
              data-testid="button-join-waitlist-nav-mobile"
            >
              Early Access
            </Button>
            <Button
              className="hidden sm:inline-flex"
              onClick={() => scrollToSection("waitlist")}
              data-testid="button-join-waitlist-nav"
            >
              Request Early Access
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
