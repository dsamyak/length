const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

const styleSettings = {
  statement: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
  question: { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.70, style: 0.7 },
  emphasis: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  thinking: { stability: 0.60, similarity_boost: 0.75, style: 0.4 },
  celebration: { stability: 0.45, similarity_boost: 0.65, style: 0.8 }
};

const phrases = [
  // ════════════════════════════════════
  // INTRO
  // ════════════════════════════════════
  { text: "Welcome to Length Explorer!", style: 'celebration' },
  { text: "Let's learn about longer and shorter!", style: 'encouragement' },
  { text: "Discover how to compare objects by their length.", style: 'statement' },
  { text: "Are you ready? Let's go!", style: 'encouragement' },

  // ════════════════════════════════════
  // WONDER
  // ════════════════════════════════════
  { text: "Hmm, that's a great question!", style: 'thinking' },
  { text: "Great question!", style: 'celebration' },
  { text: "We compare by putting things side by side.", style: 'statement' },
  { text: "The one that stretches further is longer!", style: 'emphasis' },
  { text: "Let's see this in action through a story!", style: 'encouragement' },
  // Wonder questions (all possible from the random pool)
  { text: "John has two sticks. One reaches the wall, the other doesn't...", style: 'question' },
  { text: "Two snakes are side by side. One stretches much further!", style: 'question' },
  { text: "Emily lined up her coloured pencils on the desk...", style: 'question' },
  { text: "Michel found two ribbons on the floor...", style: 'question' },
  { text: "Sarah and Tom each have a skipping rope...", style: 'question' },

  // ════════════════════════════════════
  // STORY (per-slide narration)
  // ════════════════════════════════════
  // Slide 0: John's Pencils
  { text: "John has two pencils.", style: 'statement' },
  { text: "A long red one and a short blue one.", style: 'statement' },
  { text: "Which pencil is longer?", style: 'question' },
  // Slide 1: Comparing Side by Side
  { text: "Emily shows John a trick.", style: 'statement' },
  { text: "Line up the pencils so their left ends match.", style: 'statement' },
  { text: "The one that sticks out further on the right is longer!", style: 'emphasis' },
  // Slide 2: Longer & Shorter
  { text: "Now John sees it clearly!", style: 'statement' },
  { text: "The red pencil stretches further. It is longer!", style: 'emphasis' },
  { text: "The blue pencil stops earlier. It is shorter!", style: 'emphasis' },
  { text: "Longer means it stretches further. Shorter means it stops sooner.", style: 'statement' },
  // Slide 3: Let's Compare Everything
  { text: "John and Emily are excited!", style: 'statement' },
  { text: "They started comparing ribbons, crayons, and toy trains.", style: 'statement' },
  { text: "Can we practice more?", style: 'encouragement' },
  { text: "Your turn now!", style: 'celebration' },

  // ════════════════════════════════════
  // SIMULATE
  // ════════════════════════════════════
  { text: "Welcome to the sandbox!", style: 'celebration' },
  { text: "Tap the object that is longer or shorter.", style: 'statement' },
  { text: "Let's compare!", style: 'encouragement' },
  { text: "Now let's guess!", style: 'statement' },
  { text: "Is the yellow pencil longer or shorter than the reference?", style: 'question' },
  { text: "Look carefully and choose your answer.", style: 'statement' },
  { text: "Time to sort!", style: 'statement' },
  { text: "Drag the sticks to order them from shortest to longest.", style: 'statement' },
  { text: "You can do it!", style: 'encouragement' },
  { text: "You completed all the stations!", style: 'celebration' },
  { text: "Amazing work! Let's play some games now!", style: 'encouragement' },

  // ════════════════════════════════════
  // PLAY
  // ════════════════════════════════════
  // World intros
  { text: "Welcome to Pencil Park!", style: 'celebration' },
  { text: "Welcome to Ribbon Road!", style: 'celebration' },
  { text: "Welcome to Snake Trail!", style: 'celebration' },
  { text: "Welcome to Stick Forest!", style: 'celebration' },
  { text: "Let's see how many you can get right!", style: 'encouragement' },
  // Correct feedback
  { text: "That's correct! Amazing!", style: 'encouragement' },
  { text: "Super!", style: 'encouragement' },
  { text: "You're doing great!", style: 'encouragement' },
  { text: "Perfect answer!", style: 'celebration' },
  { text: "Well done!", style: 'encouragement' },
  // Wrong feedback
  { text: "Not quite! Look carefully at the ends.", style: 'thinking' },
  // World complete
  { text: "Pencil Park complete!", style: 'celebration' },
  { text: "Ribbon Road complete!", style: 'celebration' },
  { text: "Snake Trail complete!", style: 'celebration' },
  { text: "Stick Forest complete!", style: 'celebration' },
  { text: "You earned 3 stars! Perfect!", style: 'celebration' },
  { text: "You earned 2 stars! Great job!", style: 'encouragement' },
  { text: "You earned a star! Keep going!", style: 'encouragement' },
  { text: "Try again to earn some stars!", style: 'statement' },

  // ════════════════════════════════════
  // REFLECT
  // ════════════════════════════════════
  { text: "Let's check what you've learned!", style: 'statement' },
  { text: "Answer these quick questions about length.", style: 'statement' },
  { text: "That's right!", style: 'encouragement' },
  { text: "Not quite. Let's think about it.", style: 'thinking' },
  { text: "How confident do you feel about comparing lengths?", style: 'question' },
  { text: "Be honest! There's no wrong answer.", style: 'statement' },
  { text: "Congratulations! You completed the lesson!", style: 'celebration' },
  { text: "You are a Length Explorer!", style: 'celebration' },
  { text: "Keep comparing things around you!", style: 'encouragement' },

  // ════════════════════════════════════
  // QUESTION NARRATION (read-aloud)
  // ════════════════════════════════════
  { text: "Which pencil is LONGER?", style: 'question' },
  { text: "Which ribbon is SHORTER?", style: 'question' },
  { text: "The yellow snake is LONGER than the green snake.", style: 'question' },
  { text: "The pink stick is SHORTER than the orange stick.", style: 'question' },
  { text: "The carrot is _______ than the banana.", style: 'question' },
  { text: "Drag the sticks to order them from SHORTEST to LONGEST.", style: 'question' },
  { text: "Which one is the LONGEST?", style: 'question' },
  { text: "Milo has a stick that is 5 blocks long. Sari has a stick that is 3 blocks long. Who has the LONGER stick?", style: 'question' },
];

function sanitizeFilename(text, index) {
  const sanitized = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
  return `audio_${sanitized}_${index}.mp3`;
}

async function generateAudio() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    console.warn("⚠  VITE_ELEVENLABS_API_KEY is not set. Generating mock files + audioMap.js.");
  }

  const audioMap = {};
  
  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = sanitizeFilename(text, i);
    const filepath = path.join(OUTPUT_DIR, filename);
    const relativePath = `/assets/audio/${filename}`;
    
    audioMap[text] = relativePath;

    if (fs.existsSync(filepath)) {
      console.log(`✓ [${i}] Skipping: "${text.substring(0, 40)}..." (exists)`);
      continue;
    }

    if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_api_key_here') {
      try {
        console.log(`🎙  [${i}] Generating: "${text.substring(0, 40)}..." [${style}]`);
        const settings = styleSettings[style] || styleSettings.statement;
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: text,
            model_id: MODEL_ID,
            voice_settings: {
              stability: settings.stability,
              similarity_boost: settings.similarity_boost,
              style: settings.style,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log(`   ✓ Saved: ${filename}`);
        
        // Rate limit: 500ms between requests
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        console.error(`   ✗ Failed: ${error.message}`);
      }
    } else {
      // Mock: create placeholder file
      fs.writeFileSync(filepath, 'dummy audio content');
      console.log(`📝 [${i}] Mock: ${filename}`);
    }
  }

  // Generate audioMap.js
  const mapContent = `// Auto-generated by scripts/generate_audio.js
// Run: node scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  
  const mapDir = path.dirname(AUDIO_MAP_FILE);
  if (!fs.existsSync(mapDir)) {
    fs.mkdirSync(mapDir, { recursive: true });
  }

  fs.writeFileSync(AUDIO_MAP_FILE, mapContent);
  console.log(`\n✅ Generated audioMap.js with ${Object.keys(audioMap).length} entries.`);
  console.log(`📁 Audio files: ${OUTPUT_DIR}`);
}

generateAudio();
