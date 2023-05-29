import React from "react";
import "./App.css";
import FocusableSpan from "./components/FocusableSpan";

const text =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel sunt harum quia dignissimos assumenda voluptas eaque quo distinctio eos aliquid molestiae facilis nisi enim, deleniti rerum eius aliquam est reiciendis sed? Eligendi, nemo officia rerum ab nam provident repellat deleniti numquam enim modi impedit minima omnis id ut at ad facere? Earum, suscipit rem! Id, odio enim? Quasi quia nisi suscipit consequatur, vero unde quos est doloremque. Eveniet laborum laudantium officia. Iste fuga minima accusantium provident. Enim reprehenderit, laborum amet repudiandae distinctio, saepe repellendus adipisci porro temporibus nesciunt consequuntur error quidem eaque accusantium corrupti ullam libero, ea doloremque. Quasi, atque.";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <pre>
          {text.split(". ").map((sentence) => (
            <>
              <FocusableSpan value={sentence} />
              <br />
            </>
          ))}
        </pre>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};

export default App;
