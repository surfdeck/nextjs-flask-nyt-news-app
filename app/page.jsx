'use client'
import { useEffect, useState } from 'react'
import ArticleCard from '@/components/article-card/page'

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [section, setSection] = useState('home');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [page]);

  useEffect(() => {
    async function fetchTopStories() {
      try {
        const res = await fetch(`/api/top-stories?section=${section}&page=${page}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        const perPage = 9;
        const allResults = data.results || [];
        setTotalPages(Math.ceil(allResults.length / perPage));
        const start = (page - 1) * perPage;
        const end = start + perPage;
        setArticles(allResults.slice(start, end));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching top stories:", error);
      }
    }
    if (!isSearching) {
      fetchTopStories();
    }
  }, [section, page, isSearching]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search-articles?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      const perPage = 9;
      const allResults = data.results || [];
      setTotalPages(Math.ceil(allResults.length / perPage));
      const start = 0;
      const end = perPage;
      setArticles(allResults.slice(start, end));
    } catch (error) {
      setError(error.message);
      console.error("Error searching articles:", error);
    }
  };

  const handleSectionChange = (newSection) => {
    setIsSearching(false);
    setSection(newSection);
    setPage(1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-slate-600">
      <header className="w-full max-w-6xl text-center py-6 border-b border-zinc-800 dark:border-zinc-700">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold">NEW YORK TIMES API</h1>
        </div>
      </header>

      {error && (
        <div className="w-full max-w-6xl mt-6 text-red-600 text-center">
          <p>{error}</p>
        </div>
      )}
      
      <p className="text-center text-zinc-300 mt-2">Top stories from the New York Times</p>

      <form onSubmit={handleSearch} className="w-full max-w-3xl mt-6 flex justify-center">
        <input
          type="text"
          placeholder="Search New York Times articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-xl border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="w-full max-w-6xl mt-6 flex flex-wrap justify-center gap-3">
        {['home', 'world', 'us', 'science', 'technology', 'arts'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleSectionChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${section === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'}`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-center mt-10">
        {isSearching ? "Search Results" : `Top stories: ${section.toUpperCase()}`}
      </h2>

      {/* Breadcrumb for pagination */}
      <div className="text-center text-sm text-gray-400 mt-2">
        {`Page ${page} of ${totalPages}`}
      </div>

      <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {articles.map((article, index) => (
          <ArticleCard key={article.uri || article.url || index} article={article} />
        ))}
      </section>

      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded border border-zinc-400 text-zinc-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded border border-zinc-400 text-zinc-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}
