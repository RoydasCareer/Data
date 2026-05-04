import { Clock, Globe, Eye, ArrowRight, Bookmark } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  country: string;
  date: string;
  author: string;
  authorInitial: string;
  image: string;
  readTime: number;
  views: number;
  isNew?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  home:        { label: "Home",        color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  information: { label: "Information", color: "bg-blue-50 text-blue-700 border-blue-200" },
  jobs:        { label: "Jobs",        color: "bg-orange-50 text-orange-700 border-orange-200" },
  template:    { label: "Template",    color: "bg-purple-50 text-purple-700 border-purple-200" },
  contact:     { label: "Contact",     color: "bg-gray-50 text-gray-700 border-gray-200" },
};

const authorColors = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-orange-400 to-orange-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
];

export function BlogCard({ post }: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const config = categoryConfig[post.category] ?? categoryConfig.information;
  const colorIndex = post.author.charCodeAt(0) % authorColors.length;
  const authorGradient = authorColors[colorIndex];

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white border-gray-100 rounded-xl">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm bg-white/90 ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          {/* NEW Badge */}
          {post.isNew && (
            <div className="absolute top-3 right-3">
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                NEW
              </span>
            </div>
          )}

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 ${
              isBookmarked
                ? "bg-blue-600 text-white"
                : "bg-white/90 text-gray-500 hover:bg-white"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Country + Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Globe className="h-3 w-3 text-blue-400" />
              <span>{post.country}</span>
            </div>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Author + Read More */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${authorGradient} flex items-center justify-center shadow-sm flex-shrink-0`}
              >
                <span className="text-xs text-white font-semibold">
                  {post.authorInitial}
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium">{post.author}</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Read More
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
