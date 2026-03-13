import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
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
    <Link href={`/blog/${latestPost.slug}`}>
      <div 
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-200 group cursor-pointer"
        style={{
          paddingLeft: "10px",
          paddingRight: "16px",
          paddingTop: "8px",
          paddingBottom: "8px",
          gap: "10px",
          backgroundColor: "rgba(232, 146, 58, 0.07)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(232, 146, 58, 0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(232, 146, 58, 0.07)";
        }}
        data-testid="hero-blog-cta"
      >
        {/* New Badge */}
        <span 
          className="flex-shrink-0 font-bold uppercase text-white"
          style={{
            backgroundColor: "#E8923A",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "3px 8px",
            borderRadius: "100px",
          }}
        >
          New
        </span>
        
        {/* Post Title */}
        <span 
          className="font-medium transition-colors duration-200 group-hover:text-orange-600 flex-shrink-0 md:flex-shrink"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#2B2B2B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          data-testid="hero-blog-title"
        >
          {latestPost.title}
        </span>
        
        {/* Arrow */}
        <ArrowRight 
          className="flex-shrink-0"
          style={{
            color: "#E8923A",
            fontSize: "14px",
            width: "14px",
            height: "14px",
          }}
        />
      </div>
    </Link>
  );
}
