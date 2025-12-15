import React, { useState, useEffect } from 'react';
import { Heart, Skull, Smartphone, DollarSign, Users, Home } from 'lucide-react';
import './styles.css';
import storyData from './stories.json';

const ChoicesGame = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [stats, setStats] = useState({
    relationships: 50,
    money: 30,
    mental: 50,
    reputation: 50
  });

  // Convert array to object for easier lookup
  const storyNodes = storyData.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  // Pick a random starting node on load
  useEffect(() => {
    const allNodeKeys = Object.keys(storyNodes);
    const randomKey = allNodeKeys[Math.floor(Math.random() * allNodeKeys.length)];
    setCurrentNode(storyNodes[randomKey]);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!currentNode || !currentNode.story) return;

    setDisplayText('');
    setShowChoices(false);
    setIsTyping(true);

    let index = 0;
    const text = currentNode.story;
    const typingSpeed = 30;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => setShowChoices(true), 500);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentNode]);

  const handleChoice = (choice) => {
    // Update stats
    if (choice.stats) {
      setStats(prev => {
        const newStats = { ...prev };
        Object.keys(choice.stats).forEach(key => {
          newStats[key] = Math.max(0, Math.min(100, newStats[key] + choice.stats[key]));
        });
        return newStats;
      });
    }

    // Navigate to next node
    if (choice.nextId && storyNodes[choice.nextId]) {
      setCurrentNode(storyNodes[choice.nextId]);
    } else {
      // Fallback to random node if nextId is invalid
      const allNodeKeys = Object.keys(storyNodes);
      const randomKey = allNodeKeys[Math.floor(Math.random() * allNodeKeys.length)];
      setCurrentNode(storyNodes[randomKey]);
    }
  };

  const getStatColor = (value) => {
    if (value >= 70) return 'from-green-500 to-emerald-600';
    if (value >= 40) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  if (!currentNode) return null;

  // Map titles to icons
  const iconMap = {
    'A Late Night Call': Heart,
    'The Ex Returns': Heart,
    'Crush Confessions': Heart,
    'Jealousy Strikes': Heart,
    'First Date Disasters': Heart,
    'Breakup Blues': Heart,
    'Secret Affairs': Heart,
    'Love at First Sight': Heart,
    'Toxic Relationships': Heart,
    'Rekindled Flames': Heart,
    'Family Secrets': Home,
    'Parental Pressure': Home,
    'Sibling Rivalry': Home,
    'Generational Gaps': Home,
    'Holiday Disasters': Home,
    'Inheritance Issues': Home,
    'Family Reunions': Home,
    'Parenting Struggles': Home,
    'Moving Back Home': Home,
    'Family Traditions': Home,
    'Moral Dilemmas': Skull,
    'Right vs Wrong': Skull,
    'Guilty Conscience': Skull,
    'Temptation Calls': Skull,
    'Justice Served': Skull,
    'Honesty Tests': Skull,
    'Sacrifice Needed': Skull,
    'Greed vs Good': Skull,
    'Truth Revealed': Skull,
    'Forgiveness Sought': Skull,
    'Faith Tested': Users,
    'Spiritual Journeys': Users,
    'Religious Conflicts': Users,
    'Divine Signs': Users,
    'Church Politics': Users,
    'Conversion Debates': Users,
    'Prayer Answered': Users,
    'Sin and Redemption': Users,
    'Religious Family': Users,
    'Spiritual Doubts': Users,
    'Daily Struggles': DollarSign,
    'Unexpected Events': DollarSign,
    'Routine Disrupted': DollarSign,
    'Life Changes': DollarSign,
    'Practical Problems': DollarSign,
    'Everyday Decisions': DollarSign,
    'Real World Issues': DollarSign,
    'Adulting Hard': DollarSign,
    'Unexpected Opportunities': DollarSign,
    'Daily Dilemmas': DollarSign,
    'Funny Mishaps': Smartphone,
    'Awkward Moments': Smartphone,
    'Comedy of Errors': Smartphone,
    'Silly Situations': Smartphone,
    'Laughable Disasters': Smartphone,
    'Humorous Encounters': Smartphone,
    'Ridiculous Events': Smartphone,
    'Comedic Timing': Smartphone,
    'Funny Failures': Smartphone,
    'Lighthearted Chaos': Smartphone,
    'Heartfelt Moments': Heart,
    'Emotional Turmoil': Heart,
    'Deep Feelings': Heart,
    'Vulnerable Times': Heart,
    'Intense Emotions': Heart,
    'Feeling Overwhelmed': Heart,
    'Emotional Breakthroughs': Heart,
    'Sentimental Journeys': Heart,
    'Raw Emotions': Heart,
    'Emotional Connections': Heart,
    'Dark Thoughts': Skull,
    'Sinister Events': Skull,
    'Morbid Curiosity': Skull,
    'Shadowy Secrets': Skull,
    'Disturbing Realities': Skull,
    'Gloomy Prospects': Skull,
    'Haunting Memories': Skull,
    'Bleak Futures': Skull,
    'Twisted Desires': Skull,
    'Dark Impulses': Skull
  };

  const Icon = iconMap[currentNode.title] || Heart;

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-4xl font-bold mb-2 glitch" data-text="CHOICES">
            CHOICES
          </h1>
          <p className="text-gray-400 text-sm">every choice has consequences. no saves. no regrets.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">relationships</span>
              <span className="text-xs text-white">{stats.relationships}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.relationships)} transition-all duration-500`}
                style={{ width: `${stats.relationships}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">money</span>
              <span className="text-xs text-white">{stats.money}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.money)} transition-all duration-500`}
                style={{ width: `${stats.money}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">mental health</span>
              <span className="text-xs text-white">{stats.mental}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.mental)} transition-all duration-500`}
                style={{ width: `${stats.mental}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">reputation</span>
              <span className="text-xs text-white">{stats.reputation}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.reputation)} transition-all duration-500`}
                style={{ width: `${stats.reputation}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl mb-6 flex-1">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
                <Icon className="w-8 h-8" />
              </div>
            </div>

            {/* Story Text */}
            <div className="mb-8">
              <p className="text-lg leading-relaxed text-black">
                {displayText}
                {isTyping && <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse"></span>}
              </p>
            </div>

            {/* Choices */}
            <div className={`space-y-3 transition-all duration-500 ${showChoices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {showChoices && currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-white to-gray-100 hover:from-gray-200 hover:to-gray-300 border border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-400/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-black mr-2">→</span>
                  <span className="text-black">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer hint */}
          <div className="text-center text-gray-600 text-xs">
            <p>no progress saved. every playthrough is unique.</p>
            <p className="mt-1">refresh to start over randomly.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .glitch {
          animation: glitch 1s infinite;
        }
      `}</style>
    </div>
  );
};


export default ChoicesGame;
          