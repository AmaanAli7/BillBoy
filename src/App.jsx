import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import musicc from "./assets/musicc.mp3";

const App = () => {
  const [amount, setAmount] = useState("");
  const [namesInput, setNamesInput] = useState("");
  const [result, setResult] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const splitBill = () => {
    const totalAmount = parseInt(amount);
    if (!totalAmount || totalAmount <= 0)
      return alert("Enter valid amount");

    let names = namesInput
      .split(",")
      .map((n) => n.trim().toUpperCase())
      .filter((n) => n !== "");

    if (names.length < 2)
      return alert("Enter at least 2 names");

    const randomIndex = Math.floor(Math.random() * names.length);
    const halfAmount = Math.floor(totalAmount * 0.5);
    let remainingAmount = totalAmount - halfAmount;

    let others = names.filter((_, idx) => idx !== randomIndex);

    let weights = others.map(() => Math.random());
    let totalWeight = weights.reduce((a, b) => a + b, 0);

    let distributed = [];
    let totalDistributed = 0;

    others.forEach((person, idx) => {
      let share = Math.floor(
        (weights[idx] / totalWeight) * remainingAmount
      );
      totalDistributed += share;
      distributed.push({
        name: person,
        amount: share,
        percent: Math.floor((share / totalAmount) * 100),
      });
    });

    let difference = remainingAmount - totalDistributed;
    if (difference > 0 && distributed.length > 0) {
      distributed[0].amount += difference;
      distributed[0].percent = Math.floor(
        (distributed[0].amount / totalAmount) * 100
      );
    }

    const finalResult = [
      {
        name: names[randomIndex],
        amount: halfAmount,
        percent: 50,
        main: true,
      },
      ...distributed,
    ];

    setResult(finalResult);

    confetti({
      particleCount: 250,
      spread: 150,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center text-white">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-cyan-900 animate-pulse opacity-70"></div>

      {/* Floating Blur Orbs */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-ping"></div>
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-ping"></div>

      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src={musicc} type="audio/mpeg" />
      </audio>

      {/* Floating Music Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-cyan-500 p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300"
      >
        {isPlaying ? "🔇" : "🎵"}
      </button>

      {/* Main Panel */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(0,255,255,0.3)] rounded-3xl p-10 w-full max-w-2xl transition-all duration-500">

        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          ⚡ GOD MODE BILL SPLITTER ⚡
        </h1>

        <input
          type="number"
          placeholder="ENTER TOTAL AMOUNT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-5 bg-black/50 border border-cyan-400/40 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
        />

        <input
          type="text"
          placeholder="ENTER NAMES (A, B, C)"
          value={namesInput}
          onChange={(e) => setNamesInput(e.target.value)}
          className="w-full mb-6 bg-black/50 border border-purple-400/40 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
        />

        <button
          onClick={splitBill}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 rounded-xl text-lg font-bold hover:scale-105 transition duration-300 shadow-xl"
        >
          🎲 SUMMON DESTINY
        </button>

        {result.length > 0 && (
          <div className="mt-10 space-y-6">
            {result.map((person, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-500 ${
                  person.main
                    ? "bg-cyan-500/30 border-cyan-400 shadow-[0_0_25px_rgba(0,255,255,0.8)] scale-105"
                    : "bg-purple-500/20 border-purple-400"
                }`}
              >
                <h2 className="text-xl font-bold">
                  {person.name}
                  {person.main && " 👑 CHOSEN ONE"}
                </h2>

                <div className="w-full bg-gray-800 h-4 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${person.percent}%` }}
                  ></div>
                </div>

                <p className="mt-3 text-lg">
                  Pays ₹ {person.amount} ({person.percent}%)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
