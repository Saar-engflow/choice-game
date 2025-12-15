import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Skull, MessageCircle, UserX, Users } from 'lucide-react';
import './styles.css';

// Import all story files
import exStory from './stories/ex_story.json';
import loverStory from './stories/lover_story.json';
import secretLoverStory from './stories/secret_lover_story.json';
import crushStory from './stories/crush_story.json';
import cheatingLoverStory from './stories/cheating_lover_story.json';

const storyFiles = [
  exStory,
  loverStory,
  secretLoverStory,
  crushStory,
  cheatingLoverStory
];

const ChoicesGame = () => {
  const [currentStory, setCurrentStory] = useState(null);
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
  const [gameOver, setGameOver] = useState(false);
  const [visitedStories, setVisitedStories] = useState(new Set());

  // Create node map for current story
  const nodeMap = React.useMemo(() => {
    if (!currentStory) return {};
    return currentStory.nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [currentStory]);

  // Get unvisited stories
  const getUnvisitedStories = useCallback(() => {
    return storyFiles.filter(story => !visitedStories.has(story.id));
  }, [visitedStories]);

  // Pick a new story
  const pickNewStory = useCallback(() => {
    const unvisited = getUnvisitedStories();
    
    if (unvisited.length === 0) {
      // All stories visited, reset
      setVisitedStories(new Set());
      return storyFiles[Math.floor(Math.random() * storyFiles.length)];
    }
    
    return unvisited[Math.floor(Math.random() * unvisited.length)];
  }, [getUnvisitedStories]);

  // Initialize or pick new story
  useEffect(() => {
    if (gameOver) return;
    
    if (!currentStory) {
      const newStory = pickNewStory();
      setCurrentStory(newStory);
      if (newStory) {
        setVisitedStories(prev => new Set([...prev, newStory.id]));
      }
    }
  }, [currentStory, gameOver, pickNewStory]);

  // Set starting node when story changes
  useEffect(() => {
    if (currentStory && nodeMap[currentStory.startingNode]) {
      setCurrentNode(nodeMap[currentStory.startingNode]);
    }
  }, [currentStory, nodeMap]);

  // Check for game over
  // useEffect(() => {
  //   if (stats.mental <= 0 || stats.relationships <= 0 || stats.money <= 0) {
  //     setGameOver(true);
  //   }
  // }, [stats]);

  // Typing effect
  useEffect(() => {
    if (!currentNode || !currentNode.story || gameOver) return;

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
  }, [currentNode, gameOver]);

  const handleChoice = (choice) => {
    // Update stats
    // if (choice.stats) {
    //   setStats(prev => {
    //     const newStats = { ...prev };
    //     Object.keys(choice.stats).forEach(key => {
    //       newStats[key] = Math.max(0, Math.min(100, newStats[key] + choice.stats[key]));
    //     });
    //     return newStats;
    //   });
    // }

    // Check if this is an ending
    if (choice.isEnding) {
      // Move to next story
      const newStory = pickNewStory();
      setCurrentStory(newStory);
      if (newStory) {
        setVisitedStories(prev => new Set([...prev, newStory.id]));
      }
      return;
    }

    // Navigate to next node in current story
    if (choice.nextNode && nodeMap[choice.nextNode]) {
      setCurrentNode(nodeMap[choice.nextNode]);
    }
  };

  const restartGame = () => {
    setCurrentStory(null);
    setCurrentNode(null);
    setStats({
      relationships: 100,
      money: 100,
      mental: 100,
      reputation: 100
    });
    setVisitedStories(new Set());
    setGameOver(false);
  };

  const getStatColor = (value) => {
    if (value >= 70) return 'from-green-500 to-emerald-600';
    if (value >= 40) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getIconForStory = (storyId) => {
    switch (storyId) {
      case 'ex_story': return Skull;
      case 'lover_story': return Heart;
      case 'secret_lover_story': return UserX;
      case 'crush_story': return MessageCircle;
      case 'cheating_lover_story': return Users;
      default: return Heart;
    }
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h1 className="text-6xl font-bold mb-4 glitch" data-text="GAME OVER">GAME OVER</h1>
          <p className="text-xl mb-6">Your journey ends here.</p>
          <div className="mb-8 p-4 bg-gray-900/50 rounded-lg">
            <p className="text-lg">Stories completed: <span className="text-purple-400">{visitedStories.size}</span></p>
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

  if (!currentStory || !currentNode) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your story...</p>
        </div>
      </div>
    );
  }

  const Icon = getIconForStory(currentStory.id);
  const progress = visitedStories.size;

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8 pt-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold glitch" data-text="CHOICES">CHOICES</h1>
            <div className="text-right">
              <p className="text-xs text-gray-400">Story {progress + 1}/5</p>
              <p className="text-sm">{currentStory.title}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Each choice changes your path</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{key}</span>
                <span className="text-xs text-white">{value}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getStatColor(value)} transition-all duration-500`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
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

            {/* Story Title */}
            <h2 className="text-xl font-bold text-center mb-4 text-white">
              {currentNode.title}
            </h2>

            {/* Story Text */}
            <div className="mb-8 min-h-[120px]">
              <p className="text-lg leading-relaxed text-white">
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

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs pb-4">
            <p>Story: {currentStory.title} • Part {currentNode.id}</p>
            <p className="mt-1">{progress} stories completed • Refresh to restart</p>
          </div>
        </div>
      </div>

      <style jsx>{`
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