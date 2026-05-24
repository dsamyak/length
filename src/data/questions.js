// A diverse pool of questions covering 6 types.
export const questionPool = [
  // Type 1: Visual Pick
  {
    id: "Q001",
    type: "visual_pick",
    difficulty: 1,
    objects: [
      { id: "A", color: "#FF6B35", lengthPx: 240, label: "Red Pencil" },
      { id: "B", color: "#0FB5AE", lengthPx: 140, label: "Blue Pencil" }
    ],
    question: "Which pencil is LONGER?",
    options: [{ id: "A", text: "Red Pencil" }, { id: "B", text: "Blue Pencil" }],
    correctAnswer: "A",
    hint: "Look at which pencil takes up more space left to right!",
    narrationAudio: "/audio/narration/q001.mp3"
  },
  {
    id: "Q002",
    type: "visual_pick",
    difficulty: 1,
    objects: [
      { id: "A", color: "#6C3FC5", lengthPx: 120, label: "Purple Ribbon" },
      { id: "B", color: "#FFD700", lengthPx: 280, label: "Yellow Ribbon" }
    ],
    question: "Which ribbon is SHORTER?",
    options: [{ id: "A", text: "Purple Ribbon" }, { id: "B", text: "Yellow Ribbon" }],
    correctAnswer: "A",
    hint: "Shorter means it doesn't go as far.",
    narrationAudio: "/audio/narration/q002.mp3"
  },
  
  // Type 2: True or False
  {
    id: "Q021",
    type: "true_false",
    difficulty: 1,
    objects: [
      { id: "A", color: "#0FB5AE", lengthPx: 260, label: "Green Snake" },
      { id: "B", color: "#FFD700", lengthPx: 120, label: "Yellow Snake" }
    ],
    question: "The yellow snake is LONGER than the green snake.",
    options: [{ id: "T", text: "True" }, { id: "F", text: "False" }],
    correctAnswer: "F",
    hint: "Check which snake stretches further!",
    narrationAudio: "/audio/narration/q021.mp3"
  },
  {
    id: "Q022",
    type: "true_false",
    difficulty: 1,
    objects: [
      { id: "A", color: "#E040FB", lengthPx: 150, label: "Pink Stick" },
      { id: "B", color: "#FF6B35", lengthPx: 300, label: "Orange Stick" }
    ],
    question: "The pink stick is SHORTER than the orange stick.",
    options: [{ id: "T", text: "True" }, { id: "F", text: "False" }],
    correctAnswer: "T",
    hint: "Does the pink stick stop before the orange one?",
    narrationAudio: "/audio/narration/q022.mp3"
  },

  // Type 3: Word Fill
  {
    id: "Q041",
    type: "word_fill",
    difficulty: 2,
    objects: [
      { id: "A", color: "#FF6B35", lengthPx: 200, label: "Carrot" },
      { id: "B", color: "#FFD700", lengthPx: 140, label: "Banana" }
    ],
    question: "The carrot is _______ than the banana.",
    options: [{ id: "longer", text: "longer" }, { id: "shorter", text: "shorter" }],
    correctAnswer: "longer",
    hint: "Compare their lengths side by side.",
    narrationAudio: "/audio/narration/q041.mp3"
  },

  // Type 4: Sort Order (Shortest to Longest)
  {
    id: "Q061",
    type: "sort_order",
    difficulty: 3,
    objects: [
      { id: "A", color: "#FF6B35", lengthPx: 180, label: "Stick A" },
      { id: "B", color: "#0FB5AE", lengthPx: 100, label: "Stick B" },
      { id: "C", color: "#6C3FC5", lengthPx: 260, label: "Stick C" }
    ],
    question: "Drag the sticks to order them from SHORTEST to LONGEST.",
    correctAnswer: ["B", "A", "C"],
    hint: "Find the smallest one first!",
    narrationAudio: "/audio/narration/q061.mp3"
  },

  // Type 5: Match It
  {
    id: "Q081",
    type: "match_it",
    difficulty: 2,
    objects: [
      { id: "A", color: "#FF6B35", lengthPx: 280, label: "Red Train" },
      { id: "B", color: "#0FB5AE", lengthPx: 120, label: "Blue Train" }
    ],
    question: "Which one is the LONGEST?",
    options: [{ id: "A", text: "Red Train" }, { id: "B", text: "Blue Train" }],
    correctAnswer: "A",
    hint: "Look for the train with the most carriages.",
    narrationAudio: "/audio/narration/q081.mp3"
  },

  // Type 6: Story Problem
  {
    id: "Q091",
    type: "story_problem",
    difficulty: 3,
    objects: [],
    question: "Milo has a stick that is 5 blocks long. Sari has a stick that is 3 blocks long. Who has the LONGER stick?",
    options: [{ id: "Milo", text: "Milo" }, { id: "Sari", text: "Sari" }],
    correctAnswer: "Milo",
    hint: "Which number is bigger, 5 or 3?",
    narrationAudio: "/audio/narration/q091.mp3"
  }
];
