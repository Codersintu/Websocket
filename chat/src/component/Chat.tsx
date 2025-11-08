import img1 from "../assets/profile_marco.png"
import help from "../assets/help_icon.png"
import send from "../assets/send_button.svg"
import photo from "../assets/gallery_icon.svg"
import { useRecoilValue } from "recoil"
import { openUser } from "../Atom"
import { useEffect, useRef, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { BACKEND_URL } from "../Config"
// import EmojiPicker from "emoji-picker-react"
function Chat() {
  const openuser = useRecoilValue(openUser)
  const InputRef = useRef<HTMLInputElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [message, setMessage] = useState<{ sender: string, text: string }[]>([])


  // getting userId from token
  function getUserFromToken() {
    const token = localStorage.getItem("token2");
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ userId: string }>(token);
      console.log(decoded);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
  const user = getUserFromToken()
  const roomId = [user?.userId, openuser._id].sort().join("_")
  
  


  // when app mount that time it will run to connect to websocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("connected server");
      if (openuser._id) {
        ws.send(
          JSON.stringify({
            type: "join",
            payload: { roomId }
          })
        )
      }

    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "chat") {
        setMessage((prev) => [
          ...prev, { sender: data.payload.sender, text: data.payload.message }
        ])
      }
    }

    wsRef.current = ws;

    return () => ws.close();
  }, [openuser._id])
  // user send message to server
  function sendMessage() {
    if (!InputRef.current || !wsRef.current) return;
    const text = InputRef.current.value.trim();
    if (!text) return;

    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: { message: text, sender: user?.userId, roomId },
    }));

    InputRef.current.value = "";
  }
  useEffect(()=>{
  async function loadMessage(){
     if (!user || !openuser._id) return;
     const response=await axios.get(`${BACKEND_URL}/api/v1/chat/${roomId}`,{
      headers:{
        Authorization:localStorage.getItem("token2")
      }
     })
     console.log("wgtryhtjmdtrfed",response.data)
    setMessage(response.data.findChat.map((c:any) => ({
      sender: c.sender,
      text: c.message
    })));
   }
    loadMessage()
  },[openuser._id])
  return (
    <div className="flex-[2] flex flex-col px-5 py-4 overflow-hidden">
      {!openuser ||
        (openuser.username === "" &&
          openuser.profileImg === "" &&
          openuser._id === "") ? <div className="w-full h-screen flex flex-col justify-center items-center space-y-3 text-white">
        <p className="text-3xl font-semibold">Select a user to start chatting 💬</p>
        <p className="text-sm text-gray-400">Your conversations will appear here</p>
      </div> :
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img className="w-10 h-10 rounded-full" src={openuser.profileImg || img1} alt="" />
                <h1 className="text-white text-xl">{openuser.username}</h1>
              </div>
              <img className="w-7 h-7 cursor-pointer" src={help} alt="" />
            </div>
            <span className="border-b-2 border-b-gray-600"></span>
          </div>
          <div className="flex flex-col gap-5 mt-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent h-[calc(100vh-200px)]">
            {message.map((m, i) => (
              <div key={i} className={`p-2 rounded-md mb-5 flex max-w-xs ${m.sender === user?.userId ? "place-self-end bg-blue-300" : "self-start bg-gray-200"}`}>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center border-t-2 gap-4 border-t-gray-400 pt-4">
            <div className="flex w-full items-center gap-2 relative">
              <input
                ref={InputRef}
                type="text"
                placeholder="Type a message..."
                className="w-full border rounded-2xl px-6 py-2 pr-10 outline-none"
              />
              {/* Photo icon inside input */}
              <div className="absolute">😊</div>

            </div>
            <img
              className=" w-7 h-7 cursor-pointer opacity-80 hover:opacity-100"
              src={photo}
              alt="attach"
            />
            {/* Send button */}
            <button className="" onClick={sendMessage}>
              <img className="w-8 h-8" src={send} alt="send" />
            </button>
          </div>
        </>
      }
    </div>
  )
}

export default Chat