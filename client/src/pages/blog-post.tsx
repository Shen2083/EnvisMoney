import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import Markdown from "react-markdown";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery<{ post: BlogPost }>({
    queryKey: ["/api/blog", params.slug],
  });

  const post = data?.post;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Envis Blog`;
    } else {
      document.title = "Blog | Envis";
    }
  }, [post]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link href="/blog" data-testid="link-back-blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-px bg-muted my-8" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          ) : error || !post ? (
            <div className="text-center py-16" data-testid="text-not-found">
              <h2 className="text-2xl font-bold mb-4">Post not found</h2>
              <p className="text-muted-foreground mb-6">
                This blog post may have been removed or doesn't exist.
              </p>
              <Link href="/blog">
                <Button>View All Posts</Button>
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="heading-post-title">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </header>

              <div className="border-t pt-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none" data-testid="blog-content">
                  <Markdown>{post.content}</Markdown>
                </div>
              </div>

              <div className="border-t mt-12 pt-8">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
