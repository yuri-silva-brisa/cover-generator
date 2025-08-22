import React from "react";

export default function App() {
  const sendMessage = (type) => {
    parent.postMessage({ pluginMessage: { type } }, "*");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h3>Figma React Plugin</h3>
      <button onClick={() => sendMessage("create-rect")}>
        Criar Retângulo
      </button>
      <button
        onClick={() => sendMessage("create-text")}
        style={{ marginTop: 10 }}
      >
        Criar Texto
      </button>
    </div>
  );
}
