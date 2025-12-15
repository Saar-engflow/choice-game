# TODO: Restructure to One Huge Relationships Story

- [ ] Edit `src/generateStories.js` to generate only relationship-themed stories (remove other themes, set relationships weight to 100)
- [ ] Modify generation logic in `generateStories.js` to create 500 interconnected nodes where all choices link to random node IDs (1-500)
- [ ] Update `src/App.js` to start from a completely random node on each page load (remove storyIndex logic)
- [ ] Run the updated `generateStories.js` script to regenerate `stories.json` with relationship-only content
- [ ] Test the app to verify random starts and that all content is relationship-focused
