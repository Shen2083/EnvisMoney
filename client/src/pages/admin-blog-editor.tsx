import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";
import Markdown from "react-markdown";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlogEditor() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const isEditing = !!params.id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    document.title = isEditing ? "Edit Post | Envis Admin" : "New Post | Envis Admin";
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin-login");
    }
  }, [setLocation, isEditing]);

  const { data: postData, isLoading: isLoadingPost } = useQuery<{ post: BlogPost }>({
    queryKey: ["/api/admin/blog", params.id],
    enabled: isEditing,
  });

  useEffect(() => {
    if (postData?.post && !formLoaded) {
      setTitle(postData.post.title);
      setSlug(postData.post.slug);
      setExcerpt(postData.post.excerpt);
      setContent(postData.post.content);
      setPublished(postData.post.published);
      setSlugManuallyEdited(true);
      setFormLoaded(true);
    }
  }, [postData, formLoaded]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { title, slug, excerpt, content, published };
      const url = isEditing ? `/api/admin/blog/${params.id}` : "/api/admin/blog";
      const method = isEditing ? "PATCH" : "POST";

      const token = localStorage.getItem("adminToken");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setLocation("/admin/blog");
    },
    onError: (err: any) => {
      setError(err.message || "Failed to save post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!slug.trim()) return setError("URL slug is required");
    if (!excerpt.trim()) return setError("Excerpt is required");
    if (!content.trim()) return setError("Content is required");

    saveMutation.mutate();
  };

  if (isEditing && isLoadingPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/admin/blog" data-testid="link-back-blog">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog Manager
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-bold" data-testid="heading-editor">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
                data-testid="button-toggle-preview"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Editor" : "Preview"}
              </Button>
              <Button
                type="submit"
                className="gap-2"
                disabled={saveMutation.isPending}
                data-testid="button-save-post"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEditing ? "Update" : "Create"} Post
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" data-testid="alert-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    placeholder="post-url-slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                    className="flex-1"
                    data-testid="input-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A short summary of the post (shown in listing)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  data-testid="input-excerpt"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                  data-testid="switch-published"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {published ? "Published" : "Draft"}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{showPreview ? "Preview" : "Content"}</CardTitle>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none min-h-[300px]" data-testid="content-preview">
                  <h1>{title || "Untitled"}</h1>
                  <Markdown>{content || "*No content yet*"}</Markdown>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting (headings, bold, lists, links, etc.)
                  </p>
                  <Textarea
                    placeholder="Write your blog post content here using Markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="input-content"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
