'use client';

import Image from 'next/image';

export default function ArticleCard({ article }) {
  const isArticleSearch = !!article.headline;
  const title = isArticleSearch ? article.headline.main : article.title;
  const abstract = article.abstract || article.snippet || '';
  const byline =
    article.byline && typeof article.byline === 'object'
      ? article.byline.original
      : article.byline || '';
  const publishedDate = article.published_date || article.pub_date;

  let imageUrl = null;
  if (article.multimedia && article.multimedia.length > 0) {
    if (isArticleSearch) {
      const multimediaItem =
        article.multimedia.find((item) => item.subtype === 'thumbnail') ||
        article.multimedia[0];
      if (multimediaItem.url && !multimediaItem.url.startsWith('http')) {
        imageUrl = `https://www.nytimes.com/${multimediaItem.url}`;
      } else {
        imageUrl = multimediaItem.url;
      }
    } else {
      imageUrl = article.multimedia[0].url;
    }
  }

  const articleUrl = article.web_url || article.url;

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-800 transition transform hover:scale-105 duration-300 ease-in-out">
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
            priority
          />
        </div>
      )}
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-500 transition-colors duration-200">
          {title}
        </h2>
        {byline && (
          <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2">
            By {byline}
          </p>
        )}
        {abstract && (
          <p className="text-sm text-gray-700 dark:text-zinc-400 mt-2">
            {abstract}
          </p>
        )}
        {publishedDate && (
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Published on {new Date(publishedDate).toLocaleDateString()}
          </p>
        )}
        {(article.section || (article.news_desk && article.news_desk !== 'None')) && (
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Section: {article.section || article.news_desk}
          </p>
        )}
      </div>
      <div className="px-6 pb-4 pt-2">
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-500 hover:underline text-sm"
        >
          Read full article
        </a>
      </div>
    </div>
  );
}
