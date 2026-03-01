import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-stone-800 mb-2 tracking-tight">
        UG Life <em className="font-serif not-italic italic font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>Tracker</em>
      </h1>
      <div className="mt-4 space-y-1">
        <p className="text-xs tracking-widest uppercase text-stone-400 font-medium">Enter the first day of your UG.</p>
        <p className="text-xs tracking-widest uppercase text-stone-400 font-medium">Score each past week honestly, at the end of it.</p>
        <p className="text-xs tracking-widest uppercase text-stone-400 font-medium">No one is watching. The record is yours alone.</p>
      </div>
      <div className="mt-6 text-stone-400" style={{ fontFamily: "'DM Serif Display', serif" }}>
        <p className="italic text-sm leading-relaxed">
          "The question is not whether you'll be distracted and lazy sometimes.
        </p>
        <p className="italic text-sm leading-relaxed">
          The question is whether you'll notice, and what you'll do next."
        </p>
        <p className="mt-1 text-xs tracking-wider">— Oliver Burkeman</p>
      </div>
    </div>
  );
};
