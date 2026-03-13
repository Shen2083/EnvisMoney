import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Adjust for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      // Update the URL hash without reloading the page
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const navLinks = [
    { name: "Features", id: "features" },
    { name: "Research", id: "research" },
    { name: "Security", id: "security" },
    { name: "FAQ", id: "faq" },
  ];

  const scrollToTop = () => {
    setIsMobileMenuOpen(false);
    if (location !== "/") {
      setLocation("/");
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    window.history.pushState(null, "", "/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-border" : "bg-background/80 backdrop-blur-md border-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`link-nav-${link.id}`}
              >
                {link.name}
              </button>
            ))}
            <Link href="/blog">
              <button 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-blog-nav"
              >
                Blog
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={() => scrollToSection("waitlist")}
                data-testid="button-join-waitlist-nav"
              >
                Request Early Access
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full pt-16">
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => scrollToSection(link.id)}
                        className="text-lg font-medium py-2 text-left border-b border-border/50"
                        data-testid={`link-mobile-nav-${link.id}`}
                      >
                        {link.name}
                      </button>
                    ))}
                    <Link href="/blog">
                      <button 
                        className="text-lg font-medium py-2 text-left border-b border-border/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="link-mobile-blog-nav"
                      >
                        Blog
                      </button>
                    </Link>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => scrollToSection("waitlist")}
                      data-testid="button-join-waitlist-nav-mobile"
                    >
                      Request Early Access
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
