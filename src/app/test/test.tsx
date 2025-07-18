"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Test() {
  const [score, setScore] = useState(0);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl mb-4">Score : {score}</h2>
      <div className="flex justify-center gap-4">
        <Button onClick={() => setScore((s) => Math.max(0, s - 1))}>-</Button>
        <Button onClick={() => setScore((s) => s + 1)}>+</Button>
      </div>
    </div>
  );
}
