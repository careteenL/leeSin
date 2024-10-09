import { useEffect } from "react";
import { record } from "rrweb";

function App() {
  useEffect(() => {
    record({
      emit(event) {
        if (event.data.source === 0) {
          console.log("events", event);
        }
      },
    });
  }, []);

  return (
    <div className="App">
      <div id="parent" />
      <button
        onClick={() => {
          const p = document.querySelector("#parent");
          const n1 = document.createElement("div");
          n1.id = "1";
          const n2 = document.createElement("div");
          n2.id = "2";
          const n3 = document.createElement("div");
          n3.id = "3";
          const n4 = document.createElement("div");
          n4.id = "4";
          p.appendChild(n1);
          p.appendChild(n2);
          n1.appendChild(n3);
          n1.appendChild(n4);
        }}
      >
        test
      </button>
    </div>
  );
}

export default App;
