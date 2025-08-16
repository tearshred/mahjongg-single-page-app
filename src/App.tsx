import "./App.css";
import Board from "./components/Board";

function App() {
  return (

    // *** LEARNING NOTE ***
    // <>...</> is just the shorthand for React.Fragment, and a fragment is 
    // an “invisible” wrapper so your component can return multiple elements without adding 
    // extra DOM nodes.

    //Think of it as React saying: “I’ll hold these elements together for you in JSX, 
    // but I promise I won’t put any wrapper tag in the HTML.”

    <>
      <div>Mahjong v1</div>
      <Board />
    </>
  );
}

export default App;
