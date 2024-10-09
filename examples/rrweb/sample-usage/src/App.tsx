import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { record } from "rrweb";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

const events: any[] = [];

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    record({
      emit(event) {
        // 将 event 存入 events 数组中
        events.push(event);
      },
    });
  }, []);

  function onReplay() {
    new rrwebPlayer({
      target: document.getElementById("replay")!, // 可以自定义 DOM 元素
      // 配置项
      props: {
        events,
      },
    });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + rrweb</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={onReplay}>在下方回放页面操作</button>
      <div id="replay"></div>
    </>
  );
}

export default App;
