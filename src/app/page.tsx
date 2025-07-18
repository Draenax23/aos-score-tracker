"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const armies = [
  "Blades of Khorne", "Cities of Sigmar", "Daughters of Khaine", "Disciples of Tzeentch",
  "Flesh-eater Courts", "Fyreslayers", "Gloomspite Gitz", "Hedonites of Slaanesh", "Idoneth Deepkin",
  "Kharadron Overlords", "Lumineth Realm-lords", "Maggotkin of Nurgle", "Nighthaunt",
  "Orruk Warclans", "Seraphon", "Skaven", "Slaves to Darkness", "Sons of Behemat",
  "Stormcast Eternals", "Sylvaneth"
];

const armyImages: Record<string, string> = {
  "Blades of Khorne": "/images/khorne.jpg",
  "Cities of Sigmar": "/images/cities.jpg",
  "Daughters of Khaine": "/images/daughters.jpg",
  "Disciples of Tzeentch": "/images/tzeentch.jpg",
  "Flesh-eater Courts": "/images/flesh-eater.jpg",
  "Fyreslayers": "/images/fyreslayers.jpg",
  "Gloomspite Gitz": "/images/gloomspite.jpg",
  "Hedonites of Slaanesh": "/images/slaanesh.jpg",
  "Idoneth Deepkin": "/images/idoneth.jpg",
  "Kharadron Overlords": "/images/kharadron.jpg",
  "Lumineth Realm-lords": "/images/lumineth.jpg",
  "Maggotkin of Nurgle": "/images/nurgle.jpg",
  "Nighthaunt": "/images/nighthaunt.jpg",
  "Orruk Warclans": "/images/orruk.jpg",
  "Seraphon": "/images/seraphon.jpg",
  "Skaven": "/images/skaven.jpg",
  "Slaves to Darkness": "/images/slaves.jpg",
  "Sons of Behemat": "/images/behemat.jpg",
  "Stormcast Eternals": "/images/stormcast.jpg",
  "Sylvaneth": "/images/sylvaneth.jpg"
};

export default function AoSScoreTracker() {
  const [players, setPlayers] = useState(() => [
    { name: "", army: "", scores: Array(10).fill(0) },
    { name: "", army: "", scores: Array(10).fill(0) },
  ]);
  const [currentTurn, setCurrentTurn] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("aos-players");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("aos-players", JSON.stringify(players));
    }, 100);
    return () => clearTimeout(timeout);
  }, [players]);

  const updateScore = (playerIndex: number, index: number, delta: number, step: number, max: number) => {
    const isPrimary = index < 5;
    const expectedIndex = currentTurn - 1 + (isPrimary ? 0 : 5);
    if (index !== expectedIndex) return;
    setPlayers((prev) => {
      const updated = structuredClone(prev);
      const current = updated[playerIndex].scores[index] || 0;
      const newValue = Math.max(0, Math.min(max, current + delta));
      if (newValue !== current) {
        updated[playerIndex].scores[index] = newValue;
      }
      return updated;
    });
  };

  const updateName = (playerIndex: number, name: string) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[playerIndex].name = name;
      return updated;
    });
  };

  const updateArmy = (playerIndex: number, army: string) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[playerIndex].army = army;
      return updated;
    });
  };

  const totalScore = (scores: number[]) => scores.reduce((a, b) => a + b, 0);
  const isGameOver = currentTurn > 5;

  return (
    <main className="p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      {players.map((player, pIdx) => {
        const [p1, p2] = players;
        const t1 = totalScore(p1.scores);
        const t2 = totalScore(p2.scores);
        const outsiderIndex = t1 === t2 ? -1 : t1 > t2 ? 1 : 0;

        return (
          <Card key={pIdx} className="rounded-2xl shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${armyImages[player.army] || ""})` }}
            />
            <CardContent className="relative p-4 z-10">
              <div className="flex justify-center items-center mb-2 gap-2">
                <div className="relative">
                  <Input
                    value={player.name.toUpperCase()}
                    onChange={(e) => updateName(pIdx, e.target.value)}
                    placeholder={`Nom du joueur ${pIdx + 1}`}
                    className="bg-white/40 backdrop-blur-sm p-2 rounded-lg w-fit text-center uppercase pr-16"
                  />
                  {pIdx === outsiderIndex && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 text-xs font-bold">
                      OUTSIDER
                    </span>
                  )}
                </div>
              </div>

              <Select value={player.army} onValueChange={(value) => updateArmy(pIdx, value)}>
                <SelectTrigger className="mb-4 bg-white/60">
                  <SelectValue placeholder="Choisir une armée" />
                </SelectTrigger>
                <SelectContent>
                  {armies.map((army) => (
                    <SelectItem key={army} value={army}>
                      {army}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((tIdx) => (
                  <div
                    key={tIdx}
                    className={`grid grid-cols-2 gap-x-6 md:gap-x-8 items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm ${tIdx + 1 === currentTurn ? "ring-2 ring-blue-300" : ""}`}
                  >
                    {["Primaire", "Secondaire"].map((label, j) => {
                      const index = tIdx + j * 5;
                      const step = j === 0 ? 1 : 5;
                      const max = 10;
                      const allowedIndex = currentTurn - 1 + (j === 0 ? 0 : 5);
                      return (
                        <div key={label} className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateScore(pIdx, index, -step, step, max)}
                              disabled={player.scores[index] <= 0 || index !== allowedIndex}
                              className={player.scores[index] <= 0 || index !== allowedIndex ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center">{player.scores[index] || 0}</span>
                            <Button
                              size="sm"
                              onClick={() => updateScore(pIdx, index, step, step, max)}
                              disabled={player.scores[index] >= max || index !== allowedIndex}
                              className={player.scores[index] >= max || index !== allowedIndex ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="mt-4 inline-block font-semibold bg-white/40 backdrop-blur-sm p-2 rounded-lg">
                  Total : {totalScore(player.scores)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="col-span-full flex flex-wrap justify-between items-center mt-4 gap-2">
        <Button
          disabled={currentTurn <= 1}
          onClick={() => setCurrentTurn((t) => Math.max(1, t - 1))}
        >
          Tour précédent
        </Button>
        <span className="text-lg font-bold">
          {isGameOver ? "Fin de la partie" : `Tour ${currentTurn}`}
        </span>
        <Button
          disabled={currentTurn >= 5}
          onClick={() => setCurrentTurn((t) => Math.min(5, t + 1))}
        >
          Tour suivant
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setPlayers([
              { name: "", army: "", scores: Array(10).fill(0) },
              { name: "", army: "", scores: Array(10).fill(0) },
            ]);
            setCurrentTurn(1);
            localStorage.removeItem("aos-players");
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {isGameOver && (
        <div className="col-span-full mt-6 p-4 border rounded-xl bg-green-50">
          <h3 className="text-xl font-bold mb-4">Résumé de la partie</h3>
          <ul className="space-y-2">
            {players.map((player, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {(player.name || `Joueur ${idx + 1}`).toUpperCase()} ({player.army || "Armée inconnue"})
                </span>
                <span className="font-semibold">{totalScore(player.scores)} points</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">
            Vainqueur : {(() => {
              const [p1, p2] = players;
              const t1 = totalScore(p1.scores);
              const t2 = totalScore(p2.scores);
              if (t1 === t2) return "ÉGALITÉ";
              return t1 > t2 ? (p1.name || "Joueur 1").toUpperCase() : (p2.name || "Joueur 2").toUpperCase();
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
