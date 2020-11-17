import "./App.css";
import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

function App() {
  const [connection, setConnection] = useState(null);
  const [requestName, setRequestName] = useState("");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5555/transfer")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("Point", (x, y) => {
            document.getElementById("p2").innerHTML = x.toString();
            document.getElementById("p3").innerHTML = y.toString();
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  function startScan() {
    connection.invoke("TransferPoint");
  }

  function cancelScan() {
    connection.invoke("CancelTransfer");
  }

  function callRestApi() {
    var request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://localhost:5555/api/greeter/" + requestName,
      true
    );
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        document.getElementById("p1").innerHTML = this.response;
      } else {
        console.log("error");
      }
    };

    request.send();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <input
            className="input"
            placeholder="Your Request Here"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
          ></input>
          <button className="button" onClick={callRestApi}>
            Call Rest Api
          </button>
        </div>
        <p id="p1"></p>
        <div className="container">
          <button className="button" onClick={startScan}>
            Start Scan
          </button>
          <button className="button" onClick={cancelScan}>
            Cancel
          </button>
        </div>
        <p id="p2"></p>
        <p id="p3"></p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
