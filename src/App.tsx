import { useState } from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  const [gameKey, setGameKey] = useState(0);
  return <Board key={gameKey} onNewGame={() => setGameKey((k) => k + 1)} />;
}

export default App;
