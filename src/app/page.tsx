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
  "Flesh-eater Courts", "Fyreslayers", "Gloomspite Gitz", "Hedonites of Slaanesh", "Helsmiths of Hashut", 
  "Idoneth Deepkin", "Kharadron Overlords", "Lumineth Realm-lords", "Maggotkin of Nurgle", "Nighthaunt",
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
  "Helsmiths of Hashut": "/images/Helsmiths.jpg",
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

const clean = (str: string) => str.replace(/'/g, "’");

export default function AoSScoreTracker() {
  const [view, setView] = useState<"home" | "game" | "stats">("home");
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

  const totalScore = (scores: number[]) => scores.reduce((a, b) => a + b, 0);
  const totalSecondary = (scores: number[]) => scores.slice(5).reduce((a, b) => a + b, 0);
  const isGameOver = currentTurn > 5;

  if (view === "home") {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-[url('/images/background.jpg')] bg-cover bg-center text-white p-4">
        <h1 className="text-4xl font-bold mt-8 mb-12 text-white drop-shadow-lg text-center">AOS SCORE TRACKER</h1>
        <div className="flex flex-col items-center gap-4">
          <Button
            className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
            onClick={() => setView("game")}
          >
            NOUVELLE PARTIE
          </Button>
          <Button
            className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
            onClick={() => setView("stats")}
          >
            STATISTIQUES
          </Button>
        </div>
      </main>
    );
  }

  if (view === "stats") {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
        <p className="mb-6 text-lg text-center">Cette fonctionnalité sera disponible prochainement.</p>
        <Button onClick={() => setView("home")} className="bg-white text-black hover:bg-gray-200">MENU</Button>
      </main>
    );
  }

  return (
    <main className="p-2 sm:p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-white overflow-auto" style={{ backgroundImage: "url('/images/summary.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-black/60 p-6 rounded-xl max-w-2xl w-full text-center">
            <h3 className="text-2xl font-bold mb-4">RÉSUMÉ FIN DE PARTIE</h3>
            <div className="space-y-4 text-lg">
              {players.map((player, idx) => {
                const totalPrimaires = player.scores.slice(0, 5).reduce((a, b) => a + b, 0);
                const totalSecondaires = player.scores.slice(5).reduce((a, b) => a + b, 0);
                const total = totalPrimaires + totalSecondaires;
                const background = armyImages[player.army] || "";

                return (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden p-4 bg-black/60 backdrop-blur-sm"
                    style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="bg-black/60 p-4 rounded-lg">
                      <div className="font-semibold text-xl mb-1">
                        {(player.name || `Joueur ${idx + 1}`).toUpperCase()} ({player.army || "Armée inconnue"})
                      </div>
                      <div className="flex justify-between">
                        <span>🔹 Primaires : {totalPrimaires}</span>
                        <span>🔸 Secondaires : {totalSecondaires}</span>
                        <span className="font-bold"> Total : {total}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 font-bold text-xl">
              {(() => {
                const [p1, p2] = players;
                const t1 = totalScore(p1.scores);
                const t2 = totalScore(p2.scores);
                const s1 = totalSecondary(p1.scores);
                const s2 = totalSecondary(p2.scores);

                if (t1 === t2) {
                  if (s1 === s2) return "ÉGALITÉ";
                  const winner = s1 > s2 ? (p1.name || "Joueur 1") : (p2.name || "Joueur 2");
                  return `VICTOIRE MINEURE DE ${clean(winner).toUpperCase()}`;
                }

                const diff = Math.abs(t1 - t2);
                const winner = t1 > t2 ? (p1.name || "Joueur 1") : (p2.name || "Joueur 2");

                if (diff >= 5) return `VICTOIRE MAJEURE DE ${clean(winner).toUpperCase()}`;
                return `VICTOIRE MINEURE DE ${clean(winner).toUpperCase()}`;
              })()}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
  <Button
    className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
    onClick={() => {
      setPlayers([
        { name: "", army: "", scores: Array(10).fill(0) },
        { name: "", army: "", scores: Array(10).fill(0) },
      ]);
      setCurrentTurn(1);
      localStorage.removeItem("aos-players");
    }}
  >
    NOUVELLE PARTIE
  </Button>

  <Button
    className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
    onClick={() => setView("home")}
  >
    MENU
  </Button>
</div>
          </div>
        </div>
      )}

      {players.map((player, pIdx) => {
        const [p1, p2] = players;
        const t1 = totalScore(p1.scores);
        const t2 = totalScore(p2.scores);
        const previousT1 = totalScore(p1.scores.slice(0, currentTurn - 1)) + totalScore(p1.scores.slice(5, 5 + currentTurn - 1));
        const previousT2 = totalScore(p2.scores.slice(0, currentTurn - 1)) + totalScore(p2.scores.slice(5, 5 + currentTurn - 1));
        const outsiderIndex = currentTurn > 1 ? (previousT1 === previousT2 ? -1 : previousT1 > previousT2 ? 1 : 0) : -1;

        return (
          <Card key={pIdx} className="rounded-2xl shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${armyImages[player.army] || ""})` }}
            />
            <CardContent className="relative p-4 z-10">
              <div className="flex flex-col sm:flex-row justify-center items-center mb-2 gap-2">
                <div className="relative">
                  <Input
                    value={player.name.toUpperCase()}
                    onChange={(e) => {
                      const updated = [...players];
                      updated[pIdx].name = e.target.value;
                      setPlayers(updated);
                    }}
                    placeholder={`Nom du joueur ${pIdx + 1}`}
                    className="bg-white/40 backdrop-blur-sm p-2 rounded-lg w-full text-center uppercase pr-16"
                  />
                  {pIdx === outsiderIndex && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 text-xs font-bold">
                      OUTSIDER
                    </span>
                  )}
                </div>
              </div>

              <Select value={player.army} onValueChange={(value) => {
                const updated = [...players];
                updated[pIdx].army = value;
                setPlayers(updated);
              }}>
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
                    className={`grid grid-cols-2 gap-x-4 sm:gap-x-6 items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm ${tIdx + 1 === currentTurn ? "ring-2 ring-blue-300" : ""}`}
                  >
                    {["Primaire", "Secondaire"].map((label, j) => {
                      const index = tIdx + j * 5;
                      const step = j === 0 ? 1 : 5;
                      const max = 10;
                      const allowedIndex = currentTurn - 1 + (j === 0 ? 0 : 5);
                      const isSecondary = j === 1;
                      const secTotal = totalSecondary(player.scores);
                      const disableAdd = player.scores[index] >= max || index !== allowedIndex || (isSecondary && secTotal >= 30);
                      return (
                        <div key={label} className="flex items-center justify-between gap-1 sm:gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                const expectedIndex = currentTurn - 1 + (j === 0 ? 0 : 5);
                                if (index !== expectedIndex) return;
                                setPlayers((prev) => {
                                  const updated = structuredClone(prev);
                                  const current = updated[pIdx].scores[index] || 0;
                                  const newValue = Math.max(0, Math.min(max, current - step));
                                  if (newValue !== current) {
                                    updated[pIdx].scores[index] = newValue;
                                  }
                                  return updated;
                                });
                              }}
                              disabled={player.scores[index] <= 0 || index !== allowedIndex}
                              className={player.scores[index] <= 0 || index !== allowedIndex ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center">{player.scores[index] || 0}</span>
                            <Button
                              size="sm"
                              onClick={() => {
                                const expectedIndex = currentTurn - 1 + (j === 0 ? 0 : 5);
                                if (index !== expectedIndex) return;
                                if (j === 1 && totalSecondary(players[pIdx].scores) >= 30) return;
                                setPlayers((prev) => {
                                  const updated = structuredClone(prev);
                                  const current = updated[pIdx].scores[index] || 0;
                                  const newValue = Math.max(0, Math.min(max, current + step));
                                  if (newValue !== current) {
                                    updated[pIdx].scores[index] = newValue;
                                  }
                                  return updated;
                                });
                              }}
                              disabled={disableAdd}
                              className={disableAdd ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-semibold">
                  <div className="bg-white/40 backdrop-blur-sm p-2 rounded-lg">
                    🔹 Primaire : {player.scores.slice(0, 5).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm p-2 rounded-lg">
                    🔸 Secondaire : {player.scores.slice(5).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm p-2 rounded-lg">
                    Total : {totalScore(player.scores)}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        );
      })}

{/* Contrôle des tours + actions */}
<div className="col-span-full flex flex-col items-center gap-6 mt-6">
  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
    
    {/* Bouton précédent */}
    <Button
      className={`bg-black text-white text-xl font-semibold uppercase w-[230px] ${
        currentTurn <= 1 ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={() => setCurrentTurn((t) => Math.max(1, t - 1))}
      disabled={currentTurn <= 1}
    >
      ⬅ TOUR PRÉCÉDENT
    </Button>

    {/* Réinitialiser + Menu */}
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
        onClick={() => {
          const confirmReset = window.confirm("Voulez-vous vraiment réinitialiser la partie ?");
          if (!confirmReset) return;

          setPlayers([
            { name: "", army: "", scores: Array(10).fill(0) },
            { name: "", army: "", scores: Array(10).fill(0) },
          ]);
          setCurrentTurn(1);
          localStorage.removeItem("aos-players");
        }}
      >
        RÉINITIALISER
      </Button>

      <Button
        className="bg-black text-white text-xl font-semibold uppercase w-[230px]"
        onClick={() => setView("home")}
      >
        MENU
      </Button>
    </div>

    {/* Bouton suivant */}
    <Button
      className={`bg-black text-white text-xl font-semibold uppercase w-[230px] ${
        currentTurn >= 6 ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={() => setCurrentTurn((t) => Math.min(t + 1, 6))}
      disabled={currentTurn >= 6}
    >
      TOUR SUIVANT ➡
    </Button>
  </div>

  {/* Tour actuel centré */}
  <span className="text-lg font-bold text-white text-center">
    {isGameOver ? "FIN DE LA PARTIE" : `TOUR ${currentTurn}`}
  </span>
</div>


    </main>
  );
}