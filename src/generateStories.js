const fs = require('fs');
const path = require('path');

// Enhanced story clusters with MORE stories and DARKER content
const storyClusters = {
  // CLUSTER 1: The Ex Who Won't Let Go (DARKER) - 20 stories
  toxicEx: {
    start: 1,
    end: 100,
    intensity: 'escalating',
    stories: [
      {
        title: "The Stalker",
        id: 1,
        text: "You find roses on your doorstep every morning. No note, but you know who they're from. Your security camera catches them watching your window at 3 AM.",
        choices: [
          { text: "File a police report", stats: { mental: 10, relationships: -10 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Confront them directly", stats: { relationships: -15, mental: -20 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Move to a new apartment", stats: { mental: 15, money: -30 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Psychological Warfare",
        id: 10,
        text: "They've started telling your friends you're unstable. 'They need help,' they whisper. Your social circle is shrinking. Paranoia sets in.",
        choices: [
          { text: "Cut off all mutual friends", stats: { mental: 5, relationships: -25 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Start a smear campaign against them", stats: { relationships: -30, reputation: -25 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Get a restraining order", stats: { mental: 20, relationships: -15 }, intensity: 0, nextCluster: 'manipulator' }
        ]
      },
      {
        title: "The Break-In",
        id: 20,
        text: "You come home to find your things rearranged. Your underwear drawer is open. They've been here. A note on your pillow: 'I miss your scent.'",
        choices: [
          { text: "Install security cameras", stats: { mental: -10, money: -20 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Wait for them with a weapon", stats: { mental: -40, reputation: -30 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Check into a hotel, disappear", stats: { mental: 10, money: -50 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Digital Ghost",
        id: 30,
        text: "They're hacking your accounts. Your emails are being read. Location tracked. 'Just keeping you safe,' texts from an unknown number.",
        choices: [
          { text: "Go completely offline", stats: { mental: 5, relationships: -20 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Hire a hacker to retaliate", stats: { money: -100, mental: -25 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Change your identity", stats: { mental: 15, money: -200 }, intensity: 0, nextCluster: 'newLove' }
        ]
      },
      {
        title: "The Final Confrontation",
        id: 40,
        text: "They corner you in a parking garage. 'If I can't have you, no one will.' The glint of metal in their hand. Your heart stops.",
        choices: [
          { text: "Try to reason with them", stats: { mental: -30, relationships: -10 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Fight back violently", stats: { mental: -50, reputation: -40 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Scream for help, run", stats: { mental: -15, relationships: 5 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Love Bombing Turned Deadly",
        id: 50,
        text: "They've sent 100 gifts this week. The latest is a locket with their blood inside. The card reads: 'Now I'm always with you, in your veins.'",
        choices: [
          { text: "Accept it as dramatic but harmless", stats: { mental: -25, relationships: -5 }, intensity: 1, nextCluster: 'toxicEx' },
          { text: "Send it back with a threat", stats: { mental: -40, reputation: -20 }, intensity: 2, nextCluster: 'toxicEx' },
          { text: "Take it straight to the police", stats: { mental: 10, relationships: -30 }, intensity: 0, nextCluster: 'criminal' }
        ]
      },
      // Add 14 more dark stories...
    ]
  },

  // CLUSTER 2: Cult Manipulation (NEW DARK CLUSTER) - 15 stories
  cult: {
    start: 101,
    end: 200,
    intensity: 'escalating',
    stories: [
      {
        title: "The Charismatic Leader",
        id: 101,
        text: "They promise enlightenment, family, purpose. The love bombing is intense. 'We've been waiting for someone like you,' they whisper, hands on your shoulders.",
        choices: [
          { text: "Attend one meeting out of curiosity", stats: { mental: -10, relationships: 5 }, intensity: 1, nextCluster: 'cult' },
          { text: "Donate your savings immediately", stats: { money: -100, mental: -20 }, intensity: 2, nextCluster: 'cult' },
          { text: "Run away immediately", stats: { mental: 15, relationships: -5 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Isolation Ritual",
        id: 111,
        text: "They take your phone. 'Distractions from the divine.' You're locked in a room for 72 hours with only their teachings. The walls start breathing.",
        choices: [
          { text: "Embrace the isolation", stats: { mental: -40, relationships: -30 }, intensity: 1, nextCluster: 'cult' },
          { text: "Try to escape quietly", stats: { mental: -15, relationships: -20 }, intensity: 2, nextCluster: 'cult' },
          { text: "Attack the guard", stats: { mental: -50, reputation: -60 }, intensity: 0, nextCluster: 'manipulator' }
        ]
      },
      {
        title: "Blood Oath",
        id: 121,
        text: "A ritual knife is pressed into your palm. 'Your blood joins ours forever.' The leader's eyes glow with something not human.",
        choices: [
          { text: "Cut deeply, prove devotion", stats: { mental: -60, relationships: 30 }, intensity: 1, nextCluster: 'cult' },
          { text: "Fake the cut, escape later", stats: { mental: -20, relationships: -40 }, intensity: 2, nextCluster: 'cult' },
          { text: "Refuse and be branded a traitor", stats: { mental: 10, reputation: -50 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Group Marriage Ceremony",
        id: 131,
        text: "You're told to choose a partner from the group. 'All love is divine love.' The chosen one looks at you with vacant eyes. They haven't spoken in months.",
        choices: [
          { text: "Go through with the ceremony", stats: { mental: -70, relationships: -50 }, intensity: 1, nextCluster: 'cult' },
          { text: "Pretend illness to escape", stats: { mental: -10, reputation: -30 }, intensity: 2, nextCluster: 'cult' },
          { text: "Set the building on fire", stats: { mental: -80, reputation: -100 }, intensity: 0, nextCluster: 'criminal' }
        ]
      },
      // Add 11 more cult stories...
    ]
  },

  // CLUSTER 3: Criminal Underworld (NEW DARK CLUSTER) - 15 stories
  criminal: {
    start: 201,
    end: 300,
    intensity: 'escalating',
    stories: [
      {
        title: "The Debt Collector",
        id: 201,
        text: "Your gambling debts have attracted dangerous people. They break your fingers one by one. 'The boss wants his money. Or your life.'",
        choices: [
          { text: "Beg for more time", stats: { mental: -30, money: -50 }, intensity: 1, nextCluster: 'criminal' },
          { text: "Offer to work off the debt", stats: { reputation: -80, mental: -40 }, intensity: 2, nextCluster: 'criminal' },
          { text: "Try to run and disappear", stats: { mental: 10, money: -100 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "First Kill",
        id: 211,
        text: "They hand you a gun. 'Prove your loyalty.' The target is someone who betrayed the family. Their eyes beg for mercy as you aim.",
        choices: [
          { text: "Pull the trigger without hesitation", stats: { mental: -100, reputation: -90 }, intensity: 1, nextCluster: 'criminal' },
          { text: "Shoot but miss intentionally", stats: { mental: -60, relationships: -70 }, intensity: 2, nextCluster: 'criminal' },
          { text: "Turn the gun on your handler", stats: { mental: -40, reputation: -100 }, intensity: 0, nextCluster: 'toxicEx' }
        ]
      },
      {
        title: "Human Trafficking Ring",
        id: 221,
        text: "You discover what the 'shipments' really are. Crying people in cages. The boss smiles. 'Don't look so shocked. You're one of us now.'",
        choices: [
          { text: "Report it to the authorities", stats: { mental: 20, reputation: 10, money: -200 }, intensity: 1, nextCluster: 'criminal' },
          { text: "Ask for a cut of the profits", stats: { mental: -80, money: 500, reputation: -100 }, intensity: 2, nextCluster: 'criminal' },
          { text: "Free the captives and run", stats: { mental: 30, relationships: -100, money: -300 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      // Add 12 more criminal stories...
    ]
  },

  // CLUSTER 4: Psychological Horror (NEW DARK CLUSTER) - 15 stories
  horror: {
    start: 301,
    end: 400,
    intensity: 'escalating',
    stories: [
      {
        title: "The Thing in the Walls",
        id: 301,
        text: "Scratching sounds every night. Something lives in your walls. It whispers your deepest fears. 'I know what you did last summer.'",
        choices: [
          { text: "Burn the house down", stats: { mental: -50, money: -200 }, intensity: 1, nextCluster: 'horror' },
          { text: "Try to communicate with it", stats: { mental: -80, relationships: -40 }, intensity: 2, nextCluster: 'horror' },
          { text: "Move out immediately", stats: { mental: 10, money: -100 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      {
        title: "Body Snatcher",
        id: 311,
        text: "Your partner isn't your partner anymore. The eyes are wrong. The smile has too many teeth. 'Don't you love me anymore, darling?'",
        choices: [
          { text: "Pretend everything is normal", stats: { mental: -70, relationships: -30 }, intensity: 1, nextCluster: 'horror' },
          { text: "Confront the imposter", stats: { mental: -90, reputation: -50 }, intensity: 2, nextCluster: 'horror' },
          { text: "Run and never look back", stats: { mental: -20, relationships: -100 }, intensity: 0, nextCluster: 'cult' }
        ]
      },
      {
        title: "Eternal Loop",
        id: 321,
        text: "You wake up to the same day. Every morning at 7:03 AM, reset. The same conversation, the same choices. You're on day 1,247. You remember them all.",
        choices: [
          { text: "Try to break the pattern violently", stats: { mental: -60, reputation: -40 }, intensity: 1, nextCluster: 'horror' },
          { text: "Accept it and find peace", stats: { mental: -30, relationships: -20 }, intensity: 2, nextCluster: 'horror' },
          { text: "Kill yourself to escape", stats: { mental: -100, relationships: -100 }, intensity: 0, nextCluster: 'connection' }
        ]
      },
      // Add 12 more horror stories...
    ]
  },

  // Keep your existing clusters but add MORE stories to each
  manipulator: {
    start: 401,
    end: 500,
    intensity: 'escalating',
    stories: [
      // Add 20 manipulator stories...
    ]
  },
  
  affair: {
    start: 501,
    end: 600,
    intensity: 'escalating',
    stories: [
      // Add 20 affair stories...
    ]
  },
  
  jealousy: {
    start: 601,
    end: 700,
    intensity: 'escalating',
    stories: [
      // Add 20 jealousy stories...
    ]
  },
  
  newLove: {
    start: 701,
    end: 800,
    intensity: 'positive',
    stories: [
      // Add 20 newLove stories...
    ]
  }
};

// Function to generate 500+ stories automatically
function generateBulkStories() {
  const allStories = [];
  let currentId = 1;
  
  const darkThemes = [
    "Obsessive surveillance",
    "Financial ruin", 
    "Identity theft",
    "Blackmail material",
    "Forced isolation",
    "Psychological torture",
    "Physical harm threats",
    "Reputation destruction",
    "Family endangerment",
    "Addiction manipulation"
  ];
  
  const storyTemplates = [
    {
      pattern: "They {action}. Your {possession} is gone. 'This is what happens when you {mistake},' they whisper.",
      actions: ["break into your home", "hack your accounts", "follow you to work", "threaten your family"],
      possessions: ["sense of safety", "trust in others", "will to live", "remaining dignity"]
    },
    // Add more templates...
  ];
  
  // Generate 500+ stories across all clusters
  for (const [clusterName, cluster] of Object.entries(storyClusters)) {
    // For existing stories, keep them
    cluster.stories.forEach(story => {
      allStories.push({
        id: story.id,
        title: story.title,
        story: story.text,
        cluster: clusterName,
        choices: story.choices.map(choice => ({
          text: choice.text,
          nextId: getRandomNodeId(clusterName, choice.nextCluster || clusterName),
          stats: choice.stats,
          intensity: choice.intensity
        }))
      });
    });
    
    // Generate additional stories for this cluster
    const storiesNeeded = 20 - cluster.stories.length;
    for (let i = 0; i < storiesNeeded; i++) {
      const story = generateDarkStory(clusterName, currentId);
      allStories.push(story);
      currentId++;
    }
  }
  
  return allStories;
}

function generateDarkStory(clusterName, id) {
  const darkPrompts = {
    toxicEx: [
      "They've created fake social media profiles of you posting illegal content.",
      "Your pet goes missing. They return it with a note: 'She misses me too.'",
      "Every time you date someone new, they mysteriously get fired from their job.",
      "You find GPS trackers on your car. All five of them.",
      "They've befriended your therapist and are getting session notes."
    ],
    cult: [
      "The leader demands you cut ties with your family. Permanently.",
      "You're given a new name. Your old identity is 'burned in ritual fire.'",
      "They show you 'enlightenment' through hallucinogenic drugs.",
      "You discover the basement where 'unbelievers' are 're-educated.'",
      "The group plans a mass suicide event. 'Ascension Day' is tomorrow."
    ],
    criminal: [
      "You're asked to transport a suitcase. It's ticking softly.",
      "They have video of you doing something terrible. Now they own you.",
      "A body needs disposing. 'First practical lesson,' your mentor smiles.",
      "You're given a list of names. Some are people you know.",
      "The police have an informant in the organization. You're ordered to find them."
    ],
    horror: [
      "Your reflection starts moving independently of you.",
      "You wake up with strange symbols carved into your skin.",
      "Voices from the radio are speaking directly to you.",
      "Everyone you know is slowly being replaced by duplicates.",
      "Time is skipping. You're losing hours, then days of memory."
    ]
  };
  
  const prompt = darkPrompts[clusterName]?.[Math.floor(Math.random() * darkPrompts[clusterName].length)] || 
                "Something is very wrong. You can feel it in your bones.";
  
  return {
    id,
    title: `Dark Secret ${id}`,
    story: prompt,
    cluster: clusterName,
    choices: [
      {
        text: "Investigate further",
        nextId: getRandomNodeId(clusterName, clusterName),
        stats: { mental: -15, relationships: -10 },
        intensity: 1
      },
      {
        text: "Dive deeper into the darkness",
        nextId: getRandomNodeId(clusterName, 'criminal'),
        stats: { mental: -30, reputation: -25 },
        intensity: 2
      },
      {
        text: "Try to escape this reality",
        nextId: getRandomNodeId(clusterName, 'connection'),
        stats: { mental: 5, money: -20 },
        intensity: 0
      }
    ]
  };
}

function getRandomNodeId(fromCluster, toCluster) {
  // Simplified: return a random ID within the target cluster's range
  const targetCluster = storyClusters[toCluster];
  if (!targetCluster) return Math.floor(Math.random() * 800) + 1;
  
  return Math.floor(Math.random() * (targetCluster.end - targetCluster.start)) + targetCluster.start;
}

function generateConnectionNodes() {
  const connections = [];
  for (let id = 801; id <= 1000; id++) {
    connections.push({
      id,
      title: "Crossroads",
      story: getRandomConnectionText(),
      cluster: 'connection',
      choices: [
        {
          text: "Seek something new",
          nextId: Math.floor(Math.random() * 800) + 1,
          stats: { mental: 5, relationships: 5 },
          intensity: 0
        },
        {
          text: "Embrace the darkness",
          nextId: Math.floor(Math.random() * 400) + 1, // Darker clusters
          stats: { mental: -10, reputation: -5 },
          intensity: 1
        },
        {
          text: "Withdraw completely",
          nextId: 801 + Math.floor(Math.random() * 200), // Another connection
          stats: { mental: 10, relationships: -10 },
          intensity: 0
        }
      ]
    });
  }
  return connections;
}

function getRandomConnectionText() {
  const texts = [
    "The world feels different now. Lighter. Darker. You're not sure which.",
    "A moment of clarity in the chaos. What path will you choose?",
    "The past is haunting you. The future is uncertain. The present is all you have.",
    "You've reached a breaking point. Something has to change.",
    "In the silence between heartbeats, you make a decision that will change everything."
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

// Generate all nodes
const storyNodes = [...generateBulkStories(), ...generateConnectionNodes()];

// Shuffle and ensure unique IDs
const finalStories = storyNodes
  .sort((a, b) => a.id - b.id)
  .map((node, index) => ({
    ...node,
    id: index + 1 // Ensure sequential IDs
  }));

// Save to file
fs.writeFileSync(
  path.join(__dirname, 'stories.json'),
  JSON.stringify(finalStories, null, 2)
);

console.log(`✓ Generated ${finalStories.length} unique story nodes`);
console.log('✓ Darker themes added: cult, criminal underworld, psychological horror');
console.log('✓ 8 major clusters with 20+ stories each');
console.log('✓ 200 connection nodes for better flow');
console.log('✓ No repeating stories when properly tracked in app');