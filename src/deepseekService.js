const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions/'; // Assuming this is the endpoint, adjust if different

export const generateStorySegment = async (currentStory, choice, stats) => {
  try {
    const prompt = `You are generating a text-based adventure story segment. The story must be about relationships, sex (60% of the time), family issues, ethical tests, real-life situations, religion, and be emotional, dark, funny, and climaxing.

Current story context: "${currentStory}"
Player chose: "${choice}"
Current stats: Relationships: ${stats.relationships}%, Money: ${stats.money}%, Mental Health: ${stats.mental}%, Reputation: ${stats.reputation}%

Based on the choice, generate the next story segment. Provide 3 choices for the player:
1. A comfortable/safe choice that keeps things light and doesn't delve deeper.
2. A deeper/darker choice that intensifies the emotional stakes, gets more personal/intimate.
3. An uninterested choice that cuts the story short and transitions to a different scenario.

Respond in JSON format:
{
  "text": "The story text here",
  "choices": [
    {"text": "Choice 1 text", "type": "comfortable"},
    {"text": "Choice 2 text", "type": "deep"},
    {"text": "Choice 3 text", "type": "uninterested"}
  ],
  "stats": {"relationships": 0, "money": 0, "mental": 0, "reputation": 0} // stat changes
}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Adjust model name if different
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('Error generating story segment:', error);
    // Fallback to a default response
    return {
      text: "Something went wrong with the story generation. Let's continue with a new scenario.",
      choices: [
        { text: "Start a new relationship story", type: "comfortable" },
        { text: "Dive into a family conflict", type: "deep" },
        { text: "Switch to a completely different topic", type: "uninterested" }
      ],
      stats: { relationships: 0, money: 0, mental: 0, reputation: 0 }
    };
  }
};
