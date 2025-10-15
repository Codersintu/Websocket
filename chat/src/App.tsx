import { useEffect, useRef, useState } from 'react';
import './App.css';


function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [roomId, setRoomId] = useState<string>("room1");
  const wsRef = useRef<WebSocket | null>(null);
  const [username]=useState("User"+Math.floor(Math.random()*1000));
  

  function sendMessage() {
    if (!inputRef.current || !wsRef.current) return;
    const text= inputRef.current.value.trim();
    if (!text) return;

    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: { message:text,sender:username },
    }));

    inputRef.current.value = "";
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to server");
      // STEP 1: Send join message
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId },
      }));
    };

    ws.onmessage = (event) => {
      const data=JSON.parse(event.data);
      if(data.type === "chat"){
        setMessages((prev) => [...prev,{sender:data.payload.sender,text:data.payload.message }]);
      }
    };

    wsRef.current = ws;

     return () => {
    ws.close();
  };
  }, [roomId]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50">
      <div className="h-5/6 md:w-1/2 min-w-1/2 border flex flex-col justify-between shadow-md rounded-lg">
        <div className="flex justify-between items-center p-3 border-b">
          <span className="font-semibold">Room: {roomId}</span>
          {messages.map(m=>m.sender).includes(username) &&
         <span className="font-bold">{username}: </span>}
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
            <option value="room3">Room 3</option>
          </select>
        </div>

        <div className="flex flex-col h-full w-full p-4 gap-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md flex max-w-xs ${
                m.sender === username ? 'self-end bg-blue-200' : 'self-start bg-gray-200'
              }`}
            > 
            <span className="text-sm text-black block">{m.sender}:</span>
              <span>{m.text}</span>
            </div>
          ))}
        </div>

        <div className="flex border-t p-3">
          <input
            type="text"
            ref={inputRef}
            placeholder="Type a message..."
            className="flex-grow border rounded-l-md px-3 py-2 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
