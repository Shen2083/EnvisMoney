import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "Blog | Envis - Your Family's Financial Partner";
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["api", "blog"],
  });

  const allPosts = data?.posts || [];
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="heading-blog">
              The Envis Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and stories about managing money together as a couple and family.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse h-full">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : allPosts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground" data-testid="text-no-posts">
              <p className="text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="h-full">
                    <Card className="hover-elevate cursor-pointer h-full flex flex-col" data-testid={`blog-card-${post.slug}`}>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={new Date(post.createdAt).toISOString()}>
                            {new Date(post.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                        <h2 className="text-xl font-semibold mb-3 line-clamp-2" data-testid={`text-post-title-${post.slug}`}>
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-auto">
                          Read more <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    data-testid="button-pagination-prev"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-9 h-9"
                        onClick={() => goToPage(page)}
                        data-testid={`button-pagination-page-${page}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    data-testid="button-pagination-next"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
