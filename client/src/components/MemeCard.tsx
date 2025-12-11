import { Laugh, Bot, ThoughtBubble, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface MemeCardProps {
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
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const categoryColors = {
  AI: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Grok: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  xAI: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Futuristic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

export default function MemeCard({
  id,
  image,
  title,
  caption,
  category,
  reactions,
  showActions = false,
  onEdit,
  onDelete,
}: MemeCardProps) {
  const [userReactions, setUserReactions] = useState({
    laugh: false,
    robot: false,
    think: false,
  });

  const [localReactions, setLocalReactions] = useState(reactions);

  const handleReaction = (type: 'laugh' | 'robot' | 'think') => {
    const wasActive = userReactions[type];
    setUserReactions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setLocalReactions((prev) => ({
      ...prev,
      [type]: wasActive ? prev[type] - 1 : prev[type] + 1,
    }));
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full border mb-3 ${categoryColors[category]}`}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="text-slate-900 dark:text-white mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Caption */}
        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {caption}
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleReaction('laugh')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              userReactions.laugh
                ? 'bg-yellow-500/20 border border-yellow-500/50'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <span className="text-lg">😂</span>
            <span className="text-slate-700 dark:text-slate-300">
              {localReactions.laugh}
            </span>
          </button>

          <button
            onClick={() => handleReaction('robot')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              userReactions.robot
                ? 'bg-purple-500/20 border border-purple-500/50'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <span className="text-lg">🤖</span>
            <span className="text-slate-700 dark:text-slate-300">
              {localReactions.robot}
            </span>
          </button>

          <button
            onClick={() => handleReaction('think')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              userReactions.think
                ? 'bg-cyan-500/20 border border-cyan-500/50'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <span className="text-lg">🤔</span>
            <span className="text-slate-700 dark:text-slate-300">
              {localReactions.think}
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onEdit?.(id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
