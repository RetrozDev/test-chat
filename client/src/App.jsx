import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [userColors, setUserColors] = useState({});

  // Fonction pour générer une couleur aléatoire
  const generateColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => {
        // Associe une couleur si l'utilisateur n'en a pas encore
        if (!userColors[data.username]) {
          setUserColors((prevColors) => ({
            ...prevColors,
            [data.username]: generateColor(),
          }));
        }
        return [...prevMessages, data];
      });
    });

    return () => socket.off("receive_message");
  }, [userColors]);

  const joinChat = () => {
    if (username.trim()) {
      setJoined(true);
      setUserColors((prevColors) => ({
        ...prevColors,
        [username]: generateColor(),
      }));
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { username, text: message };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      {!joined ? (
        <div>
          <h2>Entre ton pseudo</h2>
          <input
            type="text"
            placeholder="Ton pseudo..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "80%", padding: "10px" }}
          />
          <button onClick={joinChat} style={{ marginLeft: "10px", padding: "10px" }}>
            Rejoindre
          </button>
        </div>
      ) : (
        <div>
          <h2>Chat en Direct</h2>
          <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>
                <strong style={{ color: userColors[msg.username] || "black" }}>
                  {msg.username}
                </strong>: {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Écris un message..."
            style={{ width: "80%", padding: "10px", marginTop: "10px" }}
          />
          <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px" }}>
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
