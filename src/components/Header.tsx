import React from 'react';

const QUOTES = [
  { text: "The question is not whether you'll be distracted and lazy sometimes. The question is whether you'll notice, and what you'll do next.", author: "Oliver Burkeman" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },
  { text: "The mind once stretched by a new idea never returns to its original dimensions.", author: "Oliver Wendell Holmes" },
  { text: "To know that we know what we know, and to know that we do not know what we do not know, that is true knowledge.", author: "Nicolaus Copernicus" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "One day, in retrospect, the years of struggle will strike you as the most beautiful.", author: "Sigmund Freud" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Life can only be understood backwards; but it must be lived forwards.", author: "Søren Kierkegaard" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Everything you've ever wanted is sitting on the other side of fear.", author: "George Addair" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "A year from now you will wish you had started today.", author: "Karen Lamb" },
];

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor((diff + startOfYear.getDay() * 24 * 60 * 60 * 1000) / (7 * 24 * 60 * 60 * 1000));
}

export const Header: React.FC = () => {
  const weekNumber = getWeekNumber(new Date());
  const quote = QUOTES[weekNumber % QUOTES.length];

  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-2 tracking-tight">
        UG Life <em className="font-serif not-italic italic font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>Tracker</em>
      </h1>
      <div className="mt-4 space-y-1">
        <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-medium">Enter the first day of your UG.</p>
        <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-medium">Score each past week honestly, at the end of it.</p>
        <p className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-medium">No one is watching. The record is yours alone.</p>
      </div>
      <div className="mt-6 text-stone-400 dark:text-stone-500" style={{ fontFamily: "'DM Serif Display', serif" }}>
        <p className="italic text-sm leading-relaxed">"{quote.text}"</p>
        <p className="mt-1 text-xs tracking-wider">— {quote.author}</p>
      </div>
    </div>
  );
};
