// Semantic helper functions to wrap text into styled narration segments
export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'encouragement' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function celebrate(text) { return { text, style: 'celebration' }; }
export function instruct(text) { return { text, style: 'statement' }; }

// ═══════════════════════════════════════════════════
// Phase: Intro
// ═══════════════════════════════════════════════════
export function introNarration() {
  return [
    celebrate("Welcome to Length Explorer!"),
    cheer("Let's learn about longer and shorter!"),
    say("Discover how to compare objects by their length."),
    cheer("Are you ready? Let's go!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Wonder
// ═══════════════════════════════════════════════════
export function wonderNarration(questionText) {
  return [
    ask(questionText),
    think("Hmm, that's a great question!"),
  ];
}

export function wonderDiscoverNarration() {
  return [
    celebrate("Great question!"),
    say("We compare by putting things side by side."),
    emphasize("The one that stretches further is longer!"),
    cheer("Let's see this in action through a story!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Story
// ═══════════════════════════════════════════════════
export function getStoryNarration(slideIndex) {
  const slides = [
    // Slide 0: John's Pencils
    [
      say("John has two pencils."),
      say("A long red one and a short blue one."),
      ask("Which pencil is longer?"),
    ],
    // Slide 1: Comparing Side by Side
    [
      say("Emily shows John a trick."),
      say("Line up the pencils so their left ends match."),
      emphasize("The one that sticks out further on the right is longer!"),
    ],
    // Slide 2: Longer & Shorter
    [
      say("Now John sees it clearly!"),
      emphasize("The red pencil stretches further. It is longer!"),
      emphasize("The blue pencil stops earlier. It is shorter!"),
      say("Longer means it stretches further. Shorter means it stops sooner."),
    ],
    // Slide 3: Let's Compare Everything
    [
      say("John and Emily are excited!"),
      say("They started comparing ribbons, crayons, and toy trains."),
      cheer("Can we practice more?"),
      celebrate("Your turn now!"),
    ],
  ];
  return slides[slideIndex] || [];
}

// ═══════════════════════════════════════════════════
// Phase: Simulate
// ═══════════════════════════════════════════════════
export function simulateStation1Intro() {
  return [
    say("Welcome to the sandbox!"),
    instruct("Tap the object that is longer or shorter."),
    cheer("Let's compare!"),
  ];
}

export function simulateStation2Intro() {
  return [
    say("Now let's guess!"),
    ask("Is the yellow pencil longer or shorter than the reference?"),
    instruct("Look carefully and choose your answer."),
  ];
}

export function simulateStation3Intro() {
  return [
    say("Time to sort!"),
    instruct("Drag the sticks to order them from shortest to longest."),
    cheer("You can do it!"),
  ];
}

export function simulateCorrect(label, comparison) {
  return [
    celebrate(`Yes! The ${label} is ${comparison}!`),
    cheer("Great job!"),
  ];
}

export function simulateAllComplete() {
  return [
    celebrate("You completed all the stations!"),
    cheer("Amazing work! Let's play some games now!"),
  ];
}

// ═══════════════════════════════════════════════════
// Phase: Play
// ═══════════════════════════════════════════════════
export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to ${worldName}!`),
    cheer("Let's see how many you can get right!"),
  ];
}

export function playReadQuestion(questionText) {
  return [
    ask(questionText),
  ];
}

export function playCorrectNarration() {
  const options = [
    [cheer("That's correct! Amazing!")],
    [cheer("Super!")],
    [cheer("You're doing great!")],
    [celebrate("Perfect answer!")],
    [cheer("Well done!")],
  ];
  return options[Math.floor(Math.random() * options.length)];
}

export function playWrongNarration() {
  return [
    think("Not quite! Look carefully at the ends."),
  ];
}

export function playWorldComplete(worldName, stars) {
  const segments = [celebrate(`${worldName} complete!`)];
  if (stars === 3) segments.push(celebrate("You earned 3 stars! Perfect!"));
  else if (stars === 2) segments.push(cheer("You earned 2 stars! Great job!"));
  else if (stars >= 1) segments.push(cheer("You earned a star! Keep going!"));
  else segments.push(say("Try again to earn some stars!"));
  return segments;
}

// ═══════════════════════════════════════════════════
// Phase: Reflect
// ═══════════════════════════════════════════════════
export function reflectIntroNarration() {
  return [
    say("Let's check what you've learned!"),
    instruct("Answer these quick questions about length."),
  ];
}

export function reflectCorrectNarration() {
  return [
    cheer("That's right!"),
  ];
}

export function reflectWrongNarration() {
  return [
    think("Not quite. Let's think about it."),
  ];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel about comparing lengths?"),
    say("Be honest! There's no wrong answer."),
  ];
}

export function reflectCertificateNarration() {
  return [
    celebrate("Congratulations! You completed the lesson!"),
    celebrate("You are a Length Explorer!"),
    cheer("Keep comparing things around you!"),
  ];
}
