
import { useEffect, useRef, useState } from 'react'
import './App.css'


function App() {
  const [socket,setSocket]=useState();
  const inputref=useRef("")
function sendMessage(){
  if (!socket) {
    return;
  }
  const message=inputref.current.value
  //@ts-ignore
  socket.send(message)
}
useEffect(()=>{
  const ws=new WebSocket("ws://localhost:8080")
  setSocket(ws)
  ws.onmessage=(e)=>{
    alert(e.data)
  }
},[])

  return (
   <div className="">
    <input ref={inputref} type="text"  placeholder='message....'/>
    <button onClick={sendMessage}>send</button>
   </div>
  )
}

export default App
