const fs = require('fs');
const path = require('path');

// Story clusters - each represents a different relationship dynamic arc
const storyClusters = {
  // CLUSTER 1: The Ex Who Won't Let Go (nodes 1-60)
  toxicEx: {
    start: 1,
    end: 60,
    intensity: 'escalating',
    stories: [
      {
        title: "Late Night Messages",
        text: "2:47 AM. Your phone buzzes. It's them again. 'I can't stop thinking about you. Please, just one more chance.' Your heart races despite knowing better.",
        choices: [
          { text: "Reply politely but firmly set boundaries", stats: { mental: 5, reputation: 5 }, intensity: 1 },
          { text: "Agree to meet up 'just to talk'", stats: { relationships: -10, mental: -5 }, intensity: 2 },
          { text: "Leave them on read, block the number", stats: { mental: 10, relationships: -5 }, intensity: 0 }
        ]
      },
      {
        title: "The Unexpected Visit",
        text: "They show up at your door, rain-soaked, eyes pleading. 'I drove two hours just to see you. Can I come in?' Your hand hesitates on the doorknob.",
        choices: [
          { text: "Let them in for coffee, keep it brief", stats: { relationships: 5, mental: -3 }, intensity: 1 },
          { text: "Pull them inside, old feelings flooding back", stats: { relationships: 10, mental: -15, reputation: -5 }, intensity: 2 },
          { text: "Tell them to leave and close the door", stats: { mental: 8, relationships: -10 }, intensity: 0 }
        ]
      },
      {
        title: "Familiar Touch",
        text: "Their hand finds yours across the table. 'Remember how good we were together?' The touch sends electricity through you, muscle memory betraying logic.",
        choices: [
          { text: "Gently pull away, change the subject", stats: { mental: 3, reputation: 5 }, intensity: 1 },
          { text: "Interlock fingers, lean closer", stats: { relationships: 15, mental: -10 }, intensity: 2 },
          { text: "Stand up abruptly, this was a mistake", stats: { mental: 5, relationships: -8 }, intensity: 0 }
        ]
      },
      {
        title: "The Bedroom Doorway",
        text: "You're at your place now. They lean against your bedroom door frame, that look in their eyes you know too well. 'I've missed every inch of you.'",
        choices: [
          { text: "Suggest watching a movie instead", stats: { mental: -5, relationships: 5 }, intensity: 1 },
          { text: "Close the distance between you", stats: { relationships: 20, mental: -20, reputation: -10 }, intensity: 2 },
          { text: "Ask them to leave now", stats: { mental: 10, relationships: -15 }, intensity: 0 }
        ]
      },
      {
        title: "Skin Against Skin",
        text: "Clothes on the floor. Their lips on your neck. 'Tell me you don't want this,' they whisper between kisses. Your body responds before your mind can protest.",
        choices: [
          { text: "Stop and talk about what this means", stats: { mental: -3, relationships: 10 }, intensity: 1 },
          { text: "Give in completely to the moment", stats: { relationships: 25, mental: -25, reputation: -15 }, intensity: 2 },
          { text: "Push them away, get dressed", stats: { mental: 15, relationships: -20 }, intensity: 0 }
        ]
      },
      {
        title: "Morning After Regrets",
        text: "Sunlight streams through the window. They're still here, arm draped over you. The weight of your choice settles in your chest like a stone.",
        choices: [
          { text: "Talk honestly about where this can go", stats: { mental: 5, relationships: 5 }, intensity: 1 },
          { text: "Pretend everything's fine, make breakfast", stats: { relationships: 10, mental: -15 }, intensity: 2 },
          { text: "Wake them up and ask them to leave", stats: { mental: 10, relationships: -25 }, intensity: 0 }
        ]
      }
    ]
  },

  // CLUSTER 2: The Forbidden Attraction (nodes 61-120)
  forbidden: {
    start: 61,
    end: 120,
    intensity: 'escalating',
    stories: [
      {
        title: "Dangerous Territory",
        text: "They're your best friend's partner. You've tried ignoring the tension, but tonight at the party, they corner you in the kitchen. 'I can't stop thinking about you.'",
        choices: [
          { text: "Laugh it off, blame the alcohol", stats: { mental: 5, reputation: 10 }, intensity: 1 },
          { text: "Admit you feel it too", stats: { relationships: -20, mental: -10, reputation: -15 }, intensity: 2 },
          { text: "Walk away without responding", stats: { mental: 3, relationships: -5 }, intensity: 0 }
        ]
      },
      {
        title: "Secret Glances",
        text: "Every group hangout becomes torture. Stolen glances across the room. Accidental touches that last too long. Your friend notices nothing, but everyone else is starting to.",
        choices: [
          { text: "Distance yourself from both of them", stats: { mental: 10, relationships: -10 }, intensity: 1 },
          { text: "Start texting them privately", stats: { relationships: -15, mental: -15, reputation: -20 }, intensity: 2 },
          { text: "Confront them about stopping this", stats: { mental: 5, reputation: 5 }, intensity: 0 }
        ]
      },
      {
        title: "The First Kiss",
        text: "They offer you a ride home. Parked outside your place, the air thick with unspoken words. They lean in slowly. 'Stop me if you want to stop.'",
        choices: [
          { text: "Turn your head, get out of the car", stats: { mental: 15, reputation: 10 }, intensity: 1 },
          { text: "Close your eyes and let it happen", stats: { relationships: -25, mental: -20, reputation: -25 }, intensity: 2 },
          { text: "Kiss them but immediately regret it", stats: { mental: -10, relationships: -15 }, intensity: 0 }
        ]
      },
      {
        title: "Secret Hotel Room",
        text: "You're here. They booked it under a fake name. 'One time,' you both agreed. But as they push you against the door, you know it won't be.",
        choices: [
          { text: "Leave before it goes too far", stats: { mental: 10, reputation: 15 }, intensity: 1 },
          { text: "Let the guilt fuel the passion", stats: { relationships: -30, mental: -30, reputation: -30 }, intensity: 2 },
          { text: "Stop and actually talk about consequences", stats: { mental: 5, relationships: -10 }, intensity: 0 }
        ]
      },
      {
        title: "Entangled",
        text: "Sheets twisted. Bodies intertwined. They trace patterns on your skin. 'I think I'm falling for you,' they whisper. Your best friend's face flashes in your mind.",
        choices: [
          { text: "Say you need to end this now", stats: { mental: 15, relationships: -20 }, intensity: 1 },
          { text: "Say you're falling too", stats: { relationships: -35, mental: -35, reputation: -35 }, intensity: 2 },
          { text: "Get dressed in silence, leave", stats: { mental: 10, relationships: -25 }, intensity: 0 }
        ]
      },
      {
        title: "The Confrontation",
        text: "Your best friend calls crying. 'Tell me it's not true. Tell me you didn't.' Someone saw you. The secret is out. Your phone feels like lead in your hand.",
        choices: [
          { text: "Confess everything, beg forgiveness", stats: { mental: -5, reputation: -20, relationships: -15 }, intensity: 1 },
          { text: "Lie and blame false rumors", stats: { relationships: -40, mental: -40, reputation: -40 }, intensity: 2 },
          { text: "Admit it and cut all contact", stats: { mental: 5, relationships: -30, reputation: -25 }, intensity: 0 }
        ]
      }
    ]
  },

  // CLUSTER 3: The Manipulator (nodes 121-180)
  manipulator: {
    start: 121,
    end: 180,
    intensity: 'escalating',
    stories: [
      {
        title: "Love Bombing",
        text: "You just met them last week, but they're already calling you their soulmate. Flowers at your door every morning. 'I've never felt this way before.' It's intoxicating.",
        choices: [
          { text: "Enjoy it but keep some distance", stats: { mental: 5, relationships: 5 }, intensity: 1 },
          { text: "Dive headfirst into the intensity", stats: { relationships: 10, mental: -10 }, intensity: 2 },
          { text: "Tell them to slow down", stats: { mental: 8, relationships: -5 }, intensity: 0 }
        ]
      },
      {
        title: "Isolated",
        text: "They suggest you skip your friend's birthday party. 'Don't you want to spend time with me instead? I thought I was special to you.' The guilt hits immediately.",
        choices: [
          { text: "Go to the party anyway", stats: { mental: 10, relationships: -10, reputation: 5 }, intensity: 1 },
          { text: "Cancel your plans to make them happy", stats: { relationships: 5, mental: -15, reputation: -10 }, intensity: 2 },
          { text: "Invite them to come with you", stats: { mental: 5, relationships: 5 }, intensity: 0 }
        ]
      },
      {
        title: "Gaslighting",
        text: "You confront them about flirting with someone else. They laugh. 'You're being crazy. I was just being friendly. Are you really this insecure?' You start doubting yourself.",
        choices: [
          { text: "Trust your gut, stand your ground", stats: { mental: 10, relationships: -15 }, intensity: 1 },
          { text: "Apologize for overreacting", stats: { relationships: 5, mental: -20, reputation: -5 }, intensity: 2 },
          { text: "Go silent, need time to think", stats: { mental: 5, relationships: -5 }, intensity: 0 }
        ]
      },
      {
        title: "Controlling",
        text: "They check your phone while you're in the shower. When you ask why, they say it's because they love you. 'If you have nothing to hide, why does it bother you?'",
        choices: [
          { text: "Set a clear boundary about privacy", stats: { mental: 15, relationships: -20 }, intensity: 1 },
          { text: "Give them your password to prove loyalty", stats: { relationships: 10, mental: -25, reputation: -15 }, intensity: 2 },
          { text: "Take back your phone and leave", stats: { mental: 20, relationships: -25 }, intensity: 0 }
        ]
      },
      {
        title: "Intermittent Reinforcement",
        text: "After days of cold silence, they show up with your favorite food and that smile. 'I'm sorry baby, I was just stressed. You know I love you more than anything.' Your heart wants to believe.",
        choices: [
          { text: "Accept the apology but stay cautious", stats: { mental: 5, relationships: 5 }, intensity: 1 },
          { text: "Fall back into their arms, relieved", stats: { relationships: 15, mental: -20 }, intensity: 2 },
          { text: "Tell them apologies aren't enough anymore", stats: { mental: 15, relationships: -20 }, intensity: 0 }
        ]
      },
      {
        title: "Walking on Eggshells",
        text: "You're scared to tell them about your promotion. They hate when good things happen to you. Sure enough: 'So you'll have even less time for me? Great.' Your joy deflates.",
        choices: [
          { text: "Defend your accomplishment", stats: { mental: 10, relationships: -15, reputation: 5 }, intensity: 1 },
          { text: "Downplay it to keep the peace", stats: { relationships: 5, mental: -25, reputation: -10 }, intensity: 2 },
          { text: "Realize this isn't love", stats: { mental: 25, relationships: -30 }, intensity: 0 }
        ]
      }
    ]
  },

  // CLUSTER 4: The Affair (nodes 181-240)
  affair: {
    start: 181,
    end: 240,
    intensity: 'escalating',
    stories: [
      {
        title: "The Coworker",
        text: "Late nights at the office. Your wedding ring feels heavy as they lean over your desk, perfume intoxicating. 'Want to grab drinks? Just us?' Your spouse is waiting at home.",
        choices: [
          { text: "Decline and mention your spouse", stats: { mental: 10, reputation: 10, relationships: 5 }, intensity: 1 },
          { text: "Agree to drinks, 'it's harmless'", stats: { relationships: -10, mental: -10, reputation: -10 }, intensity: 2 },
          { text: "Suggest a group outing instead", stats: { mental: 5, reputation: 5 }, intensity: 0 }
        ]
      },
      {
        title: "Emotional Affair",
        text: "You tell them things you don't tell your partner anymore. They listen. They understand. Your phone buzzes. Another text from them. You smile. Then the guilt hits.",
        choices: [
          { text: "Create distance, focus on your relationship", stats: { mental: 15, relationships: 10 }, intensity: 1 },
          { text: "Keep texting, tell yourself it's just friendship", stats: { relationships: -15, mental: -15, reputation: -10 }, intensity: 2 },
          { text: "Come clean to your partner", stats: { mental: 10, relationships: -5, reputation: 5 }, intensity: 0 }
        ]
      },
      {
        title: "The First Betrayal",
        text: "Conference trip. Hotel bar. Too many drinks. Their hand on your thigh. 'Your room or mine?' Your wedding ring catches the light. Your partner thinks you're in a meeting.",
        choices: [
          { text: "Go back to your own room alone", stats: { mental: 20, reputation: 15 }, intensity: 1 },
          { text: "Follow them to the elevator", stats: { relationships: -25, mental: -25, reputation: -25 }, intensity: 2 },
          { text: "Call your spouse instead", stats: { mental: 15, relationships: 10 }, intensity: 0 }
        ]
      },
      {
        title: "Crossing the Line",
        text: "Hotel room. Clothes discarded. 'We can stop,' they whisper against your neck. But you don't want to stop. For the first time in years, you feel desired. The ring on the nightstand judges you.",
        choices: [
          { text: "Stop now, before it's too late", stats: { mental: 15, reputation: 10 }, intensity: 1 },
          { text: "Surrender to the moment completely", stats: { relationships: -35, mental: -35, reputation: -35 }, intensity: 2 },
          { text: "Leave immediately, full of shame", stats: { mental: 10, relationships: -10 }, intensity: 0 }
        ]
      },
      {
        title: "Living a Double Life",
        text: "You're sleeping with both now. At home, you're distant, distracted. With them, you're alive. Your spouse asks if you're okay. You lie with practiced ease. 'Just work stress, honey.'",
        choices: [
          { text: "End the affair, work on your marriage", stats: { mental: 20, relationships: 15 }, intensity: 1 },
          { text: "Continue both, you need this feeling", stats: { relationships: -40, mental: -40, reputation: -40 }, intensity: 2 },
          { text: "Consider leaving your spouse", stats: { mental: -15, relationships: -20, reputation: -25 }, intensity: 0 }
        ]
      },
      {
        title: "Everything Crumbles",
        text: "Your spouse found the texts. Everything. They're standing there with your phone, hands shaking, tears streaming. 'How long?' they ask. You have no good answer.",
        choices: [
          { text: "Admit everything, beg for forgiveness", stats: { mental: -10, relationships: -25, reputation: -30 }, intensity: 1 },
          { text: "Minimize it, blame them for neglecting you", stats: { relationships: -45, mental: -45, reputation: -45 }, intensity: 2 },
          { text: "Pack a bag and leave", stats: { mental: -20, relationships: -35, reputation: -35 }, intensity: 0 }
        ]
      }
    ]
  },

  // CLUSTER 5: New Relationship Intensity (nodes 241-300)
  newLove: {
    start: 241,
    end: 300,
    intensity: 'escalating',
    stories: [
      {
        title: "First Date Magic",
        text: "The conversation flows effortlessly. They laugh at your jokes. Touch your arm when they talk. The chemistry is undeniable. 'I don't want this night to end,' they say softly.",
        choices: [
          { text: "Suggest getting coffee another time", stats: { mental: 5, relationships: 5, reputation: 5 }, intensity: 1 },
          { text: "Invite them back to your place", stats: { relationships: 15, mental: -5 }, intensity: 2 },
          { text: "End it here, take things slow", stats: { mental: 8, relationships: 3 }, intensity: 0 }
        ]
      },
      {
        title: "Moving Too Fast",
        text: "It's only been three dates but you're already staying over every night. Your toothbrush is at their place. They've met your friends. 'Is this crazy?' you ask. 'Maybe,' they grin, 'but I don't care.'",
        choices: [
          { text: "Pump the brakes, need some space", stats: { mental: 10, relationships: -5 }, intensity: 1 },
          { text: "Embrace the whirlwind romance", stats: { relationships: 20, mental: -10 }, intensity: 2 },
          { text: "Have a talk about pacing", stats: { mental: 5, relationships: 5 }, intensity: 0 }
        ]
      },
      {
        title: "The Sleepover",
        text: "Netflix and actual chill turns into something more. Their hands explore tentatively. 'Is this okay?' they ask between kisses. Your heart pounds. You've wanted this.",
        choices: [
          { text: "Say you want to wait a bit longer", stats: { mental: 5, relationships: 5, reputation: 5 }, intensity: 1 },
          { text: "Pull them closer, show them it's more than okay", stats: { relationships: 20, mental: 5 }, intensity: 2 },
          { text: "Stop and cuddle instead", stats: { mental: 3, relationships: 8 }, intensity: 0 }
        ]
      },
      {
        title: "First Time Together",
        text: "Nervous energy. Fumbling with buttons. Whispered encouragements. It's awkward and perfect and intense all at once. Afterwards, they hold you close. 'That was... wow.'",
        choices: [
          { text: "Talk about what this means for you both", stats: { mental: 10, relationships: 15, reputation: 5 }, intensity: 1 },
          { text: "Go for round two immediately", stats: { relationships: 25, mental: 5 }, intensity: 2 },
          { text: "Get up and get dressed, suddenly awkward", stats: { mental: -5, relationships: -10 }, intensity: 0 }
        ]
      },
      {
        title: "The L Word",
        text: "You're tangled in bedsheets, morning light filtering through curtains. They trace circles on your shoulder. 'I think I'm falling in love with you.' Your breath catches. Do you feel it too?",
        choices: [
          { text: "Say you're falling too, mean it", stats: { mental: 15, relationships: 25, reputation: 5 }, intensity: 1 },
          { text: "Kiss them instead of answering", stats: { relationships: 15, mental: -5 }, intensity: 2 },
          { text: "Panic, say it's too soon", stats: { mental: -10, relationships: -15 }, intensity: 0 }
        ]
      },
      {
        title: "Meeting the Ex",
        text: "You're out together when their ex approaches. Tension thick enough to cut. The ex looks you up and down. 'So you're the new one.' Your partner squeezes your hand protectively.",
        choices: [
          { text: "Stay calm and polite", stats: { mental: 5, relationships: 10, reputation: 10 }, intensity: 1 },
          { text: "Mark your territory, kiss them possessively", stats: { relationships: 15, reputation: -5 }, intensity: 2 },
          { text: "Feel insecure, withdraw", stats: { mental: -10, relationships: -5 }, intensity: 0 }
        ]
      }
    ]
  },

  // CLUSTER 6: Jealousy and Possessiveness (nodes 301-360)
  jealousy: {
    start: 301,
    end: 360,
    intensity: 'escalating',
    stories: [
      {
        title: "The Coworker Mention",
        text: "They mention a coworker's name for the third time tonight. You notice them smiling at their phone. A text notification: the coworker's name. Something twists in your chest.",
        choices: [
          { text: "Casually ask about them", stats: { mental: 3, relationships: 5 }, intensity: 1 },
          { text: "Demand to see their phone", stats: { relationships: -10, mental: -10, reputation: -10 }, intensity: 2 },
          { text: "Say nothing, but start monitoring", stats: { mental: -15, relationships: -5 }, intensity: 0 }
        ]
      },
      {
        title: "Social Media Stalking",
        text: "You're three years deep in their ex's Instagram at 2 AM. Comparing yourself to every photo. They were beautiful together. Are you enough? The comparison is poison.",
        choices: [
          { text: "Close the app, go to bed", stats: { mental: 10, relationships: 5 }, intensity: 1 },
          { text: "Keep scrolling, screenshot things to analyze", stats: { relationships: -5, mental: -20, reputation: -5 }, intensity: 2 },
          { text: "Block the ex so you can't look", stats: { mental: 5 }, intensity: 0 }
        ]
      },
      {
        title: "The Party",
        text: "They're across the room laughing with someone attractive. Too close. Too comfortable. They touch their arm. Your blood boils. You down your drink and march over.",
        choices: [
          { text: "Join the conversation casually", stats: { mental: 5, relationships: 5, reputation: 5 }, intensity: 1 },
          { text: "Interrupt aggressively, claim your territory", stats: { relationships: -15, mental: -15, reputation: -20 }, intensity: 2 },
          { text: "Leave the party without saying anything", stats: { mental: -10, relationships: -10 }, intensity: 0 }
        ]
      },
      {
        title: "Phone Password Changed",
        text: "Their phone password changed. 'Why do you need it?' they ask when you notice. 'Don't you trust me?' The question hangs heavy. You used to know all their passwords.",
        choices: [
          { text: "Respect their privacy", stats: { mental: 10, relationships: 10, reputation: 5 }, intensity: 1 },
          { text: "Accuse them of hiding something", stats: { relationships: -20, mental: -15, reputation: -15 }, intensity: 2 },
          { text: "Give them the silent treatment", stats: { mental: -5, relationships: -15 }, intensity: 0 }
        ]
      },
      {
        title: "Going Through Their Things",
        text: "They're in the shower. Their phone is on the table, unlocked. One look couldn't hurt. Just a quick peek at those messages. Your hand reaches for it. This is wrong. But what if...?",
        choices: [
          { text: "Resist, walk away", stats: { mental: 15, relationships: 10, reputation: 10 }, intensity: 1 },
          { text: "Read everything, screenshots for evidence", stats: { relationships: -25, mental: -25, reputation: -25 }, intensity: 2 },
          { text: "Take a quick glance at recent messages", stats: { mental: -10, relationships: -15, reputation: -10 }, intensity: 0 }
        ]
      },
      {
        title: "The Confrontation",
        text: "You found messages. Flirty. Intimate. Your hands shake as you hold up the phone. 'What is this?' you demand. They look guilty. Or is it anger? 'You went through my phone?'",
        choices: [
          { text: "Apologize for snooping, ask about messages", stats: { mental: -5, relationships: -10 }, intensity: 1 },
          { text: "Explode, throw things, scream", stats: { relationships: -35, mental: -30, reputation: -30 }, intensity: 2 },
          { text: "Pack your things in silence", stats: { mental: 5, relationships: -25 }, intensity: 0 }
        ]
      }
    ]
  }
};

// Connection nodes - bridge between clusters (nodes 361-500)
function generateConnectionNode(fromCluster, toCluster, id) {
  const transitions = [
    {
      text: "You need space to think. Maybe someone new is exactly what you need right now.",
      nextClusters: ['newLove', 'forbidden']
    },
    {
      text: "This pattern feels familiar. Too familiar. Your phone buzzes - someone from your past wants to talk.",
      nextClusters: ['toxicEx', 'manipulator']
    },
    {
      text: "At a friend's party, trying to forget. Someone's eyes meet yours across the room. Dangerous eyes.",
      nextClusters: ['forbidden', 'jealousy']
    },
    {
      text: "You're not sure what you're doing anymore. The lies are piling up. Another text lights up your screen.",
      nextClusters: ['affair', 'manipulator']
    },
    {
      text: "Maybe starting fresh is the answer. Maybe this time it'll be different. Maybe this time you won't fuck it up.",
      nextClusters: ['newLove', 'toxicEx']
    }
  ];

  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  return {
    id,
    title: "Crossroads",
    story: transition.text,
    choices: [
      { text: "Take the safe path forward", nextId: getRandomNodeFromCluster(transition.nextClusters[0]), stats: { mental: 5 } },
      { text: "Dive into the chaos", nextId: getRandomNodeFromCluster(transition.nextClusters[1] || transition.nextClusters[0]), stats: { mental: -10, relationships: 10 } },
      { text: "Withdraw from everything", nextId: Math.floor(Math.random() * 140) + 361, stats: { mental: -5, relationships: -5 } }
    ]
  };
}

function getRandomNodeFromCluster(clusterName) {
  const cluster = Object.values(storyClusters).find(c => 
    clusterName.toLowerCase().includes(c.start.toString()) || 
    Object.keys(storyClusters).find(k => k === clusterName)
  );
  
  if (!cluster) {
    const allClusters = Object.values(storyClusters);
    const randomCluster = allClusters[Math.floor(Math.random() * allClusters.length)];
    return Math.floor(Math.random() * (randomCluster.end - randomCluster.start)) + randomCluster.start;
  }
  
  return Math.floor(Math.random() * (cluster.end - cluster.start)) + cluster.start;
}

function generateNodes() {
  const nodes = [];
  
  // Generate all cluster nodes
  for (const [clusterName, cluster] of Object.entries(storyClusters)) {
    const storyCount = cluster.stories.length;
    const nodesPerStory = Math.floor((cluster.end - cluster.start + 1) / storyCount);
    
    cluster.stories.forEach((story, storyIndex) => {
      const baseId = cluster.start + (storyIndex * nodesPerStory);
      
      // Generate progressive variations of this story
      for (let variation = 0; variation < nodesPerStory; variation++) {
        const nodeId = baseId + variation;
        const intensity = Math.floor(variation / (nodesPerStory / 3)); // 0, 1, or 2
        
        // Modify story text based on intensity
        let modifiedText = story.text;
        if (variation > 0) {
          const intensityAddons = [
            " The tension escalates.",
            " Things are getting more complicated.",
            " You're in deeper than you thought.",
            " There's no easy way out of this.",
            " The weight of your choices crushes you."
          ];
          modifiedText += intensityAddons[Math.min(variation % intensityAddons.length, intensityAddons.length - 1)];
        }
        
        // Generate next node IDs
        const nextNodes = story.choices.map((choice, choiceIndex) => {
          if (choiceIndex === 0) {
            // Safe choice - stay in cluster or move to safer cluster
            if (variation < nodesPerStory - 1) {
              return baseId + variation + 1; // Next in sequence
            } else {
              return getRandomNodeFromCluster('newLove'); // Move to new relationship
            }
          } else if (choiceIndex === 1) {
            // Dark choice - escalate within cluster or jump to darker cluster
            const darkClusters = ['manipulator', 'affair', 'jealousy'];
            const randomDark = darkClusters[Math.floor(Math.random() * darkClusters.length)];
            return getRandomNodeFromCluster(randomDark);
          } else {
            // Distant choice - jump to connection node
            return Math.floor(Math.random() * 140) + 361;
          }
        });
        
        nodes.push({
          id: nodeId,
          title: story.title + (variation > 0 ? ` - Part ${variation + 1}` : ''),
          story: modifiedText,
          choices: story.choices.map((choice, idx) => ({
            text: choice.text,
            nextId: nextNodes[idx],
            stats: choice.stats
          }))
        });
      }
    });
  }
  
  // Generate connection nodes (361-500)
  const clusterNames = Object.keys(storyClusters);
  for (let id = 361; id <= 500; id++) {
    const fromCluster = clusterNames[Math.floor(Math.random() * clusterNames.length)];
    const toCluster = clusterNames[Math.floor(Math.random() * clusterNames.length)];
    nodes.push(generateConnectionNode(fromCluster, toCluster, id));
  }
  
  return nodes;
}

// Generate and save
const stories = generateNodes();
fs.writeFileSync(
  path.join(__dirname, 'stories.json'),
  JSON.stringify(stories, null, 2)
);

console.log(`✓ Generated ${stories.length} interconnected story nodes`);
console.log('✓ 6 major relationship arc clusters');
console.log('✓ Progressive difficulty escalation');
console.log('✓ 3-choice system: Safe / Dark / Distant');
console.log('✓ Mature content with emotional manipulation themes');