import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import MemeCard from '../components/MemeCard';

interface HomeProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isLoggedIn: boolean;
}

const mockMemes = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3R8ZW58MXx8fHwxNzY1MzgzNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'When AI Finally Understands Sarcasm',
    caption: 'Grok learning the difference between "great job" and "GREAT job" 🤖',
    category: 'AI' as const,
    reactions: { laugh: 342, robot: 128, think: 89 },
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1672581437674-3186b17b405a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjUzMjkxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'The Future is Now',
    caption: 'When your AI assistant starts predicting your thoughts before you think them',
    category: 'Futuristic' as const,
    reactions: { laugh: 256, robot: 189, think: 134 },
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1507162728832-5b8fdb5f99fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW5ueSUyMHJvYm90fGVufDF8fHx8MTc2NTQzNDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Grok After Too Much Training Data',
    caption: 'Me explaining why I need just one more GPU for my home lab',
    category: 'Grok' as const,
    reactions: { laugh: 512, robot: 267, think: 98 },
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1615511676712-df98fcc708d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDF8fHx8MTc2NTQzNDc5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'xAI Neural Network Vibes',
    caption: 'The inside of my brain during a debugging session at 3 AM',
    category: 'xAI' as const,
    reactions: { laugh: 445, robot: 312, think: 201 },
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGNvbXB1dGVyfGVufDF8fHx8MTc2NTQzNDc5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'AI Processing Your Request',
    caption: 'When you ask Grok a simple question but it gives you a PhD thesis',
    category: 'AI' as const,
    reactions: { laugh: 678, robot: 423, think: 156 },
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1644325349124-d1756b79dd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY1Mzc4NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Data Flowing Through AI',
    caption: 'When the gradient descent finally converges after 1000 epochs',
    category: 'Futuristic' as const,
    reactions: { laugh: 334, robot: 245, think: 189 },
  },
];

export default function Home({ darkMode, setDarkMode, isLoggedIn }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 py-16 px-4">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-pulse">🤖</div>
          <div className="absolute top-20 right-20 text-4xl animate-bounce">✨</div>
          <div className="absolute bottom-20 left-1/4 text-5xl animate-pulse delay-100">💡</div>
          <div className="absolute bottom-10 right-1/3 text-4xl animate-bounce delay-200">🚀</div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-white mb-6">
            Welcome to GrokMemeHub
          </h1>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Where AI Meets Humor - Share, discover, and enjoy the funniest AI-generated memes from the Grok community
          </p>

          {/* Video Player */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
            <div className="aspect-video bg-slate-900/50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-white/70">YouTube Video Embed</p>
                <p className="text-white/50">Grok's Greatest Moments</p>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎵</div>
              <div className="flex-1 text-left">
                <p className="text-white mb-2">Grok's Funniest Moments</p>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-1/3 rounded-full"></div>
                </div>
              </div>
              <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
                ⏸️ Pause
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search AI memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-slate-700 dark:text-slate-300 mb-2">
              <Filter className="inline-block w-4 h-4 mr-2" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="all">All Categories</option>
              <option value="AI">AI</option>
              <option value="Grok">Grok</option>
              <option value="xAI">xAI</option>
              <option value="Futuristic">Futuristic</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="trending">
                🔥 Trending
              </option>
              <option value="latest">
                ⏰ Latest
              </option>
            </select>
          </div>
        </div>

        {/* Meme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMemes.map((meme) => (
            <MemeCard key={meme.id} {...meme} />
          ))}
        </div>
      </section>
    </div>
  );
}
