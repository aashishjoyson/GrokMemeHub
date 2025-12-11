import { useState } from 'react';
import { Plus, X, Upload, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import MemeCard from '../components/MemeCard';

interface MyMemesProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Meme {
  id: string;
  image: string;
  title: string;
  caption: string;
  category: 'AI' | 'Grok' | 'xAI' | 'Futuristic';
  reactions: {
    laugh: number;
    robot: number;
    think: number;
  };
}

export default function MyMemes({ darkMode, setDarkMode }: MyMemesProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [memes, setMemes] = useState<Meme[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3R8ZW58MXx8fHwxNzY1MzgzNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'My First AI Meme',
      caption: 'When you finally understand how neural networks work',
      category: 'AI',
      reactions: { laugh: 42, robot: 28, think: 15 },
    },
  ]);

  // Form states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'AI' | 'Grok' | 'xAI' | 'Futuristic'>('AI');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memeToDelete, setMemeToDelete] = useState<string | null>(null);

  const charCount = caption.length;
  const maxChars = 140;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMeme: Meme = {
      id: Date.now().toString(),
      image: imageUrl || 'https://images.unsplash.com/photo-1644325349124-d1756b79dd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY1Mzc4NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title,
      caption,
      category,
      reactions: { laugh: 0, robot: 0, think: 0 },
    };

    setMemes([newMeme, ...memes]);
    
    // Reset form
    setTitle('');
    setCaption('');
    setImageUrl('');
    setCategory('AI');
    setShowUploadForm(false);
  };

  const handleEdit = (id: string) => {
    const meme = memes.find(m => m.id === id);
    if (meme) {
      setTitle(meme.title);
      setCaption(meme.caption);
      setImageUrl(meme.image);
      setCategory(meme.category);
      setShowUploadForm(true);
      setMemes(memes.filter(m => m.id !== id));
    }
  };

  const handleDeleteClick = (id: string) => {
    setMemeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (memeToDelete) {
      setMemes(memes.filter(m => m.id !== memeToDelete));
      setMemeToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isLoggedIn={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-slate-900 dark:text-white mb-2">
              My Meme Collection
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {memes.length} {memes.length === 1 ? 'meme' : 'memes'} in your collection
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            {showUploadForm ? (
              <>
                <X className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Upload New Meme
              </>
            )}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl animate-in slide-in-from-top">
            <h3 className="text-slate-900 dark:text-white mb-6">
              Upload Your Meme
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your meme a catchy title..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Caption Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 dark:text-slate-300">
                    Caption
                  </label>
                  <span className={`${charCount > maxChars ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {charCount}/{maxChars} chars
                  </span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a funny caption..."
                  maxLength={maxChars}
                  rows={3}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="AI">AI</option>
                  <option value="Grok">Grok</option>
                  <option value="xAI">xAI</option>
                  <option value="Futuristic">Futuristic</option>
                </select>
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <Upload className="w-5 h-5" />
                Upload Meme
              </button>
            </form>
          </div>
        )}

        {/* Memes Grid */}
        {memes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard
                key={meme.id}
                {...meme}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🎨</div>
            <h3 className="text-slate-900 dark:text-white mb-3">
              No memes yet!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Start creating your meme collection by clicking the "Upload New Meme" button above
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Your First Meme
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white mb-2">
                    Delete Meme?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete this meme? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
