const fs = require('fs');
const path = require('path');

// Only relationships theme for one huge story
const themes = [
  { name: 'relationships', weight: 100 }
];

// Templates for each theme (only relationships now)
const templates = {
  relationships: {
    titles: ['A Late Night Call', 'The Ex Returns', 'Crush Confessions', 'Jealousy Strikes', 'First Date Disasters', 'Breakup Blues', 'Secret Affairs', 'Love at First Sight', 'Toxic Relationships', 'Rekindled Flames'],
    stories: [
      "You receive a text from your ex at 2am. \"I miss you.\" Your heart races. What do you do?",
      "Your crush posts a story with someone else. Jealousy consumes you. How do you react?",
      "A friend confesses they have feelings for you. You never saw it coming. What now?",
      "You catch your partner texting someone suspiciously. Confrontation time.",
      "The person you like asks you out. Butterflies everywhere. Your response?",
      "Your relationship is falling apart. One last attempt to save it?",
      "A one-night stand turns into something more. Or does it?",
      "You find old love letters from your ex. Do you read them?",
      "Your partner suggests an open relationship. How do you feel?",
      "A blind date goes horribly wrong. Or does it?"
    ],
    choices: [
      ['Keep it casual and light', 'Dive deeper into feelings', 'Change the subject completely'],
      ['Post a fun selfie', 'Send a heartfelt message', 'Block and move on'],
      ['Laugh it off', 'Share your own feelings', 'End the conversation'],
      ['Ask calmly', 'Confront angrily', 'Walk away'],
      ['Say yes with excitement', 'Think about it', 'Say no politely'],
      ['Talk openly', 'Give space', 'Break up'],
      ['Keep it fun', 'Get serious', 'Stop seeing them'],
      ['Read them', 'Burn them', 'Save for later'],
      ['Try it out', 'Say no', 'Need time'],
      ['Apologize', 'Blame them', 'Leave']
    ]
  }
};

// Function to select theme based on weights
function selectTheme() {
  const totalWeight = themes.reduce((sum, theme) => sum + theme.weight, 0);
  let random = Math.random() * totalWeight;
  for (const theme of themes) {
    random -= theme.weight;
    if (random <= 0) return theme.name;
  }
  return themes[0].name;
}

// Generate a node
function generateNode(id, title, story, choices) {
  return {
    id,
    title,
    story,
    choices
  };
}

// Generate continuation chains
function generateChain(startId, theme, depth, isDeep = false) {
  const nodes = [];
  let currentId = startId;
  const template = templates[theme];

  for (let i = 0; i < depth; i++) {
    const index = Math.floor(Math.random() * template.titles.length);
    let continuationStory = template.stories[index];
    let continuationTitle = template.titles[index];

    if (isDeep) {
      // Make deeper/darker
      continuationStory += " The situation intensifies, pulling you deeper into complex emotions.";
      continuationTitle += " - Deepening";
    } else {
      // Keep light
      continuationStory += " Things remain pleasant and uncomplicated.";
      continuationTitle += " - Continuing Lightly";
    }

    const choices = [
      { text: isDeep ? "Embrace the intensity" : "Keep it light", nextId: currentId + 1 },
      { text: isDeep ? "Go even deeper" : "Stay comfortable", nextId: currentId + 1 },
      { text: "Move to a new story", nextId: Math.floor(Math.random() * 17) + 1 } // Jump to random starting node
    ];

    nodes.push(generateNode(currentId, continuationTitle, continuationStory, choices));
    currentId++;
  }

  // End of chain links to random node
  if (nodes.length > 0) {
    nodes[nodes.length - 1].choices[0].nextId = Math.floor(Math.random() * 500) + 1;
    nodes[nodes.length - 1].choices[1].nextId = Math.floor(Math.random() * 500) + 1;
  }

  return nodes;
}

// Generate 500 interconnected nodes for one huge relationships story
function generateStories() {
  const nodes = [];
  const template = templates.relationships;

  for (let id = 1; id <= 500; id++) {
    const index = Math.floor(Math.random() * template.titles.length);

    // Create choices that link to random nodes (1-500)
    const choices = template.choices[index].map(text => ({
      text,
      nextId: Math.floor(Math.random() * 500) + 1
    }));

    nodes.push(generateNode(id, template.titles[index], template.stories[index], choices));
  }

  return nodes;
}

// Write to file
const stories = generateStories();
fs.writeFileSync(path.join(__dirname, 'stories.json'), JSON.stringify(stories, null, 2));
console.log('Generated 500 story nodes with continuations in stories.json');
