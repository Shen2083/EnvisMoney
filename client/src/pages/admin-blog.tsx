import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, FileText, LogOut } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";

export default function AdminBlog() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Blog Manager | Envis Admin";
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const { data, isLoading, error } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["/api/admin/blog"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    },
  });

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/admin" data-testid="link-back-admin">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost">Home</Button>
          </Link>
          <div className="ml-auto">
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
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="heading-blog-manager">
                Blog Manager
              </h1>
              <p className="text-muted-foreground">
                Create and manage blog posts for Envis
              </p>
            </div>
            <Link href="/admin/blog/new">
              <Button className="gap-2" data-testid="button-new-post">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-posts">
                  {isLoading ? "..." : posts.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-published-count">
                  {isLoading ? "..." : posts.filter(p => p.published).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-drafts-count">
                  {isLoading ? "..." : posts.filter(p => !p.published).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-loading">
                  Loading blog posts...
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive" data-testid="text-error">
                  Error loading blog posts. Please try again.
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-empty">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No blog posts yet</p>
                  <p className="mb-4">Create your first blog post to get started.</p>
                  <Link href="/admin/blog/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-md border flex-wrap"
                      data-testid={`blog-post-row-${post.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-medium truncate" data-testid={`text-post-title-${post.id}`}>
                            {post.title}
                          </h3>
                          <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                          {" · "}
                          /blog/{post.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublishMutation.mutate({ id: post.id, published: !post.published })}
                          data-testid={`button-toggle-publish-${post.id}`}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button size="icon" variant="ghost" data-testid={`button-edit-${post.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this post?")) {
                              deleteMutation.mutate(post.id);
                            }
                          }}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
