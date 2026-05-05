import { Clock, Eye, Globe, ArrowRight, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { type Post, CATEGORY_META } from '../data/posts';

interface PostCardProps {
  post: Post;
  viewMode: 'grid' | 'list';
}

const AUTHOR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
];

export function PostCard({ post, viewMode }: PostCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const meta = CATEGORY_META[post.category];
  const authorColor = AUTHOR_COLORS[post.author.charCodeAt(0) % AUTHOR_COLORS.length];
  const dateStr = new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });

  if (viewMode === 'list') {
    return (
      <article className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-36 sm:w-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {!imgError ? (
            <img
              src={post.image}
              alt={post.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ aspectRatio: '4/3' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
              <Globe className="h-8 w-8 text-blue-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start gap-2 mb-2">
            <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${meta.color}`}>
              {meta.labelKr}
            </span>
            {post.isNew && (
              <span className="flex-shrink-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">NEW</span>
            )}
            <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{dateStr}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
            {post.title}
          </h3>
          <p className="text-xs text-gray-500 mb-1">{post.titleKr}</p>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">{post.excerptKr}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-blue-400" />{post.country}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}분</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views.toLocaleString()}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {!imgError ? (
          <img
            src={post.image}
            alt={post.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Globe className="h-12 w-12 text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm bg-white/90 ${meta.color}`}>
            {meta.labelKr} <span className="opacity-70">{meta.labelEn}</span>
          </span>
        </div>

        {/* NEW badge */}
        {post.isNew && (
          <div className="absolute top-3 right-10">
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">NEW</span>
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 ${bookmarked ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-500 hover:bg-white'}`}
          aria-label="북마크"
        >
          <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Globe className="h-3 w-3 text-blue-400" />
            {post.country}
          </span>
          <span className="text-xs text-gray-400">{dateStr}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
          {post.title}
        </h3>
        <p className="text-xs text-blue-500 font-medium mb-2 line-clamp-1">{post.titleKr}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{post.excerptKr}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}분 읽기</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${authorColor} flex items-center justify-center flex-shrink-0`}>
              <span className="text-xs text-white font-semibold">{post.authorInitial}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">{post.author}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            더 보기 <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}
