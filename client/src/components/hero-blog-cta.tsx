import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

export function HeroBlogCTA() {
  const { data } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["api", "blog"],
  });

  const latestPost = data?.posts?.[0];

  if (!latestPost) {
    return null;
  }

  return (
    <Link
      href={`/blog/${latestPost.slug}`}
      data-testid="hero-blog-cta"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 16px 8px 10px",
        backgroundColor: "rgba(232, 146, 58, 0.07)",
        borderRadius: "100px",
        maxWidth: "100%",
        overflow: "hidden",
        cursor: "pointer",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(232, 146, 58, 0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(232, 146, 58, 0.07)";
      }}
    >
      {/* Badge */}
      <span
        className="font-bold uppercase text-white"
        style={{
          backgroundColor: "#E8923A",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          padding: "3px 8px",
          borderRadius: "100px",
          flexShrink: 0,
        }}
      >
        Latest
      </span>

      {/* Post Title */}
      <span
        className="font-medium text-foreground"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
          flex: 1,
        }}
        data-testid="hero-blog-title"
      >
        {latestPost.title}
      </span>

      {/* Arrow */}
      <span
        style={{
          color: "#E8923A",
          flexShrink: 0,
          fontSize: "14px",
          lineHeight: 1,
        }}
      >
        →
      </span>
    </Link>
  );
}
