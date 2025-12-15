import React, { useState, useEffect, useCallback } from 'react';
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
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // Memoize the story nodes object
  const storyNodes = React.useMemo(() => {
    return storyData.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, []);

  // Get unvisited nodes
  const getUnvisitedNodes = useCallback(() => {
    return Object.keys(storyNodes).filter(id => !visitedNodes.has(parseInt(id)));
  }, [storyNodes, visitedNodes]);

  // Pick a new unvisited node
  const pickNewNode = useCallback(() => {
    const unvisited = getUnvisitedNodes();
    
    if (unvisited.length === 0) {
      // All nodes visited - either restart or pick random
      console.log('All stories visited!');
      const allNodes = Object.keys(storyNodes);
      const randomKey = allNodes[Math.floor(Math.random() * allNodes.length)];
      return storyNodes[randomKey];
    }

    // Weighted selection based on mental health
    const unvisitedNodes = unvisited.map(id => storyNodes[id]);
    
    if (stats.mental < 30) {
      // Low mental health: 80% chance dark, 20% random
      const darkClusters = ['toxicEx', 'cult', 'criminal', 'horror', 'manipulator'];
      const darkNodes = unvisitedNodes.filter(node => darkClusters.includes(node.cluster));
      if (darkNodes.length > 0 && Math.random() < 0.8) {
        return darkNodes[Math.floor(Math.random() * darkNodes.length)];
      }
    } else if (stats.mental > 70) {
      // High mental health: 80% chance light, 20% random
      const lightClusters = ['newLove', 'connection'];
      const lightNodes = unvisitedNodes.filter(node => lightClusters.includes(node.cluster));
      if (lightNodes.length > 0 && Math.random() < 0.8) {
        return lightNodes[Math.floor(Math.random() * lightNodes.length)];
      }
    }
    
    // Random from unvisited
    return unvisitedNodes[Math.floor(Math.random() * unvisitedNodes.length)];
  }, [getUnvisitedNodes, storyNodes, stats.mental]);

  // Check for game over
  useEffect(() => {
    if (stats.mental <= 0 || stats.relationships <= 0 || stats.money <= 0) {
      setGameOver(true);
    }
  }, [stats]);

  // Initialize or pick new node
  useEffect(() => {
    if (gameOver) return;
    
    if (!currentNode) {
      // First load - pick starting node
      const newNode = pickNewNode();
      setCurrentNode(newNode);
      if (newNode) {
        setVisitedNodes(prev => new Set([...prev, newNode.id]));
      }
    }
  }, [currentNode, gameOver, pickNewNode]);

  // Update progress percentage
  useEffect(() => {
    if (storyNodes && visitedNodes.size > 0) {
      const progress = Math.round((visitedNodes.size / Object.keys(storyNodes).length) * 100);
      setStoryProgress(Math.min(progress, 100));
    }
  }, [visitedNodes, storyNodes]);

  // Typing effect
  useEffect(() => {
    if (!currentNode || !currentNode.story || gameOver) return;

    setDisplayText('');
    setShowChoices(false);
    setIsTyping(true);

    let index = 0;
    const text = currentNode.story;
    const typingSpeed = Math.max(10, Math.min(50, 100 - stats.mental)); // Faster when stressed

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => setShowChoices(true), 300);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentNode, gameOver, stats.mental]);

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
    let nextNode;
    if (choice.nextId && storyNodes[choice.nextId]) {
      nextNode = storyNodes[choice.nextId];
    } else {
      // Fallback to random unvisited node
      nextNode = pickNewNode();
    }

    if (nextNode) {
      setCurrentNode(nextNode);
      setVisitedNodes(prev => new Set([...prev, nextNode.id]));
    }
  };

  const restartGame = () => {
    setCurrentNode(null);
    setStats({
      relationships: 50,
      money: 30,
      mental: 50,
      reputation: 50
    });
    setVisitedNodes(new Set());
    setGameOver(false);
    setStoryProgress(0);
  };

  const getStatColor = (value) => {
    if (value >= 70) return 'from-green-500 to-emerald-600';
    if (value >= 40) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getIconForCluster = (cluster) => {
    const darkClusters = ['toxicEx', 'cult', 'criminal', 'horror', 'manipulator'];
    return darkClusters.includes(cluster) ? Skull : Heart;
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-4 glitch" data-text="GAME OVER">GAME OVER</h1>
          <p className="text-xl mb-6">Your journey ends here.</p>
          <div className="mb-8 p-4 bg-gray-900/50 rounded-lg">
            <p className="text-lg">Stories explored: <span className="text-purple-400">{visitedNodes.size}</span></p>
            <p className="text-sm text-gray-400 mt-2">Progress: {storyProgress}%</p>
          </div>
          <button
            onClick={restartGame}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition font-bold text-lg"
          >
            START NEW JOURNEY
          </button>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your story...</p>
        </div>
      </div>
    );
  }

  const Icon = getIconForCluster(currentNode.cluster);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
          style={{ width: `${storyProgress}%` }}
        ></div>
      </div>

      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className={`absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          stats.mental < 30 ? 'bg-red-900' : 'bg-purple-600'
        }`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 pt-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold glitch" data-text="CHOICES">CHOICES</h1>
            <div className="text-right">
              <p className="text-xs text-gray-400">Story #{currentNode.id}</p>
              <p className="text-xs">{currentNode.cluster}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Unique stories: {visitedNodes.size}/1000+</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{key}</span>
                <span className={`text-xs font-bold ${
                  value < 30 ? 'text-red-400' : value < 70 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {value}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getStatColor(value)} transition-all duration-300`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Card */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-2xl mb-6 flex-1">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center animate-pulse ${
                stats.mental < 30 ? 'bg-gradient-to-br from-red-900 to-black' : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-white">
              {currentNode.title}
            </h2>

            {/* Story Text */}
            <div className="mb-8 min-h-[100px]">
              <p className="text-base sm:text-lg leading-relaxed text-white">
                {displayText}
                {isTyping && <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse"></span>}
              </p>
            </div>

            {/* Choices */}
            <div className={`space-y-3 transition-all duration-300 ${
              showChoices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
              {showChoices && currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-white to-gray-100 hover:from-gray-200 hover:to-gray-300 border border-gray-300 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-black mr-2">›</span>
                  <span className="text-black text-sm sm:text-base">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs pb-4">
            <p>{visitedNodes.size} unique stories explored • {storyProgress}% complete</p>
            <p className="mt-1">Refresh to restart • Choices are permanent</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }

        .glitch {
          animation: glitch 0.5s infinite;
        }

        @media (max-width: 640px) {
          .glitch {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ChoicesGame;