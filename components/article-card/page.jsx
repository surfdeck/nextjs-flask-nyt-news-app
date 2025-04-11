'use client'

export default function ArticleCard({ article }) {
  // Determine if this article is from Article Search (it has a headline) or Top Stories.
  const isArticleSearch = !!article.headline;

  // Title: For search results, use the headline.main; otherwise, use the title.
  const title = isArticleSearch ? article.headline.main : article.title;

  // Abstract: Prioritize article.abstract if available; otherwise, use snippet for search results.
  const abstract = article.abstract || article.snippet || "";

  // Byline: If byline is an object, assume the content is in the original property.
  const byline =
    article.byline && typeof article.byline === 'object'
      ? article.byline.original
      : article.byline || "";

  // Published Date: Use published_date for Top Stories or pub_date for search.
  const publishedDate = article.published_date || article.pub_date;

  // Multimedia: Process multimedia items differently depending on the API.
  let imageUrl = null;
  if (article.multimedia && article.multimedia.length > 0) {
    if (isArticleSearch) {
      // Try to find a multimedia item with subtype 'thumbnail'; otherwise, default to the first item.
      const multimediaItem =
        article.multimedia.find((item) => item.subtype === 'thumbnail') ||
        article.multimedia[0];
      if (multimediaItem.url && !multimediaItem.url.startsWith('http')) {
        imageUrl = `https://www.nytimes.com/${multimediaItem.url}`;
      } else {
        imageUrl = multimediaItem.url;
      }
    } else {
      // For Top Stories, simply take the first available multimedia item's URL.
      imageUrl = article.multimedia[0].url;
    }
  }

  // Link to the full article: Use web_url for Article Search articles or url for Top Stories.
  const articleUrl = article.web_url || article.url;

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-800 transition transform hover:scale-105 duration-300 ease-in-out">
      {imageUrl && (
        <img
          className="w-full h-48 object-cover rounded-t-xl"
          src={imageUrl}
          alt={title}
        />
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
        {(article.section || (article.news_desk && article.news_desk !== "None")) && (
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
