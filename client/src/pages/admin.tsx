import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Users, LogOut } from "lucide-react";
import type { Waitlist } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Admin Dashboard | Envis";
    
    // Check if authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const { data, isLoading, error } = useQuery<{ entries: Waitlist[] }>({
    queryKey: ["/api/waitlist"],
  });

  const entries = data?.entries || [];

  const exportToCSV = () => {
    if (entries.length === 0) return;

    const headers = ["Name", "Email", "Family Size", "Interests", "Joined Date"];
    const rows = entries.map(entry => [
      entry.name,
      entry.email,
      entry.familySize,
      entry.interests || "N/A",
      new Date(entry.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `envis-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="heading-admin-dashboard">
                Waitlist Dashboard
              </h1>
              <p className="text-muted-foreground">
                View and manage all waitlist signups for Envis
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("adminToken");
                setLocation("/admin-login");
              }}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Signups
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-signups">
                  {isLoading ? "..." : entries.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  People on the waitlist
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Export Data
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button
                  onClick={exportToCSV}
                  disabled={entries.length === 0}
                  className="w-full"
                  data-testid="button-export-csv"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Export all entries to spreadsheet
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Waitlist Entries</CardTitle>
              <CardDescription>
                All email addresses that have joined the waitlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-loading">
                  Loading waitlist entries...
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive" data-testid="text-error">
                  Error loading waitlist entries. Please try again.
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-empty">
                  No waitlist entries yet. Share the signup form to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="table-waitlist">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Family Size</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Interests</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr
                          key={entry.id}
                          className="border-b last:border-0 hover-elevate"
                          data-testid={`row-entry-${index}`}
                        >
                          <td className="py-3 px-4 text-sm" data-testid={`text-name-${index}`}>
                            {entry.name}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono" data-testid={`text-email-${index}`}>
                            {entry.email}
                          </td>
                          <td className="py-3 px-4 text-sm" data-testid={`text-family-size-${index}`}>
                            {entry.familySize}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground" data-testid={`text-interests-${index}`}>
                            {entry.interests || "—"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground" data-testid={`text-date-${index}`}>
                            {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
