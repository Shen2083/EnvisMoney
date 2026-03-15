import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import type { BlogPost } from "@shared/schema";

export function HeroBlogCTA() {
  const { data } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["api", "blog"],
  });

  const recentPosts = data?.posts?.slice(0, 3) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const isPaused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cycle = useCallback(() => {
    if (isPaused.current) return;
    setVisible(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % recentPosts.length);
      setVisible(true);
    }, 400);
  }, [recentPosts.length]);

  useEffect(() => {
    if (recentPosts.length <= 1) return;
    timerRef.current = setInterval(cycle, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cycle, recentPosts.length]);

  if (recentPosts.length === 0) {
    return null;
  }

  const activePost = recentPosts[activeIndex] ?? recentPosts[0];

  return (
    <Link
      href={`/blog/${activePost.slug}`}
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
        isPaused.current = true;
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(232, 146, 58, 0.12)";
      }}
      onMouseLeave={(e) => {
        isPaused.current = false;
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

      {/* Post Title - animated */}
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
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
        data-testid="hero-blog-title"
      >
        {activePost.title}
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
