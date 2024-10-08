"use client"
import React, { useEffect, useRef } from 'react';
import type { Move } from 'chess.js';

const History: React.FC<{ history: Array<Move> }> = ({ history }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [history]);

  return (
    <pre className="float-right h-[525px] w-[120px]">
      {history.map(({ color, piece, from, san , to }) => `${from} ${to}`).join('\n')}
      <div ref={endRef} />
    </pre>
  );
};

export default History;
