export interface Quote {
  id: number;
  text: string;
  source: string;
  author: string;
  length: "short" | "medium" | "long" | "thicc";
}

export const QUOTES: Quote[] = [
  // Short
  {
    id: 1,
    text: "Simplicity is prerequisite for reliability.",
    source: "Notes on Structured Programming",
    author: "Edsger W. Dijkstra",
    length: "short",
  },
  {
    id: 2,
    text: "Talk is cheap. Show me the code.",
    source: "Linux Kernel Mailing List",
    author: "Linus Torvalds",
    length: "short",
  },
  {
    id: 3,
    text: "Stay hungry, stay foolish.",
    source: "Stanford Commencement Address",
    author: "Steve Jobs",
    length: "short",
  },
  {
    id: 4,
    text: "Make it work, make it right, make it fast.",
    source: "The Mythical Man-Month",
    author: "Kent Beck",
    length: "short",
  },
  {
    id: 5,
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    source: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson",
    length: "short",
  },

  // Medium
  {
    id: 6,
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    source: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    length: "medium",
  },
  {
    id: 7,
    text: "The most disastrous thing that you can ever learn is your first programming language, because it forms the prejudices through which you look at all others.",
    source: "Interview",
    author: "Alan Kay",
    length: "medium",
  },
  {
    id: 8,
    text: "Premature optimization is the root of all evil in software engineering. We should forget about small efficiencies about ninety-seven percent of the time.",
    source: "Structured Programming with go to Statements",
    author: "Donald Knuth",
    length: "medium",
  },
  {
    id: 9,
    text: "There are only two hard things in Computer Science: cache invalidation and naming things, and off-by-one errors.",
    source: "Phil Karlton's law",
    author: "Phil Karlton",
    length: "medium",
  },
  {
    id: 10,
    text: "I do not fear computers. I fear the lack of them. A computer does not take sides; it is a servant to anyone who understands how to instruct it.",
    source: "Asimov on Science",
    author: "Isaac Asimov",
    length: "medium",
  },

  // Long
  {
    id: 11,
    text: "Computers are incredibly fast, accurate, and stupid. Human beings are incredibly slow, inaccurate, and brilliant. Together they are powerful beyond imagination. The question is not whether intelligent machines can have any emotions, but whether machines can be intelligent without any emotions.",
    source: "Speech on Computation",
    author: "Albert Einstein & Leo Cherne",
    length: "long",
  },
  {
    id: 12,
    text: "If debugging is the process of removing software bugs, then programming must be the process of putting them in. Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris.",
    source: "Programming Perl",
    author: "Larry Wall",
    length: "long",
  },
  {
    id: 13,
    text: "A user interface is like a joke. If you have to explain it, it is not that good. The details are not the details. They make the design. Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects.",
    source: "Ten Principles of Good Design",
    author: "Dieter Rams",
    length: "long",
  },

  // Thicc
  {
    id: 14,
    text: "The function of good software is to make the complex appear to be simple. We build our computer systems the way we build our cities: over time, without a plan, on top of ruins. Walking on water and developing software from a specification are easy if both are frozen. Measuring programming progress by lines of code is like measuring aircraft building progress by weight. Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
    source: "Software Engineering Proverbs",
    author: "John Woods & Grady Booch",
    length: "thicc",
  },
  {
    id: 15,
    text: "The computing scientist's main challenge is not to get confused by the complexities of his own making. The question of whether machines can think is about as relevant as the question of whether submarines can swim. Progress is possible only if we train ourselves to think about programs without thinking of them as pieces of executable code. Elegance is not a dispensable luxury, but a factor that decides between success and failure.",
    source: "Selected Writings on Computing",
    author: "Edsger W. Dijkstra",
    length: "thicc",
  },
];

export function getRandomQuote(lengthCategory?: "short" | "medium" | "long" | "thicc" | "all"): Quote {
  const filtered = !lengthCategory || lengthCategory === "all"
    ? QUOTES
    : QUOTES.filter((q) => q.length === lengthCategory);

  const pool = filtered.length > 0 ? filtered : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
