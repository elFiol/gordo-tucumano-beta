import { useEffect } from "react";
import { initPhaser } from "./js/game/initphaser";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  useEffect(() => {
    const game = initPhaser("game-container");
    return () => game.destroy(true);
  }, []);

  return (
    <>
    <div className="App">
      <h1>gordo tucumano + Phaser</h1>
      <div id="game-container"></div>
    </div>
    </>
  );
}

export default App;
