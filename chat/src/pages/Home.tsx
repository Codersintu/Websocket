
import Chat from "../component/Chat"
// import RightSide from "../component/RightSide"
import Sidebar from "../component/Sidebar"


function Home() {
  return (
    <div className="w-full h-screen border sm:px-[15%] sm:py-[5%]">
      <div className="backdrop-blur-xl flex border-2 border-gray-600 rounded-2xl h-[100%] shadow-2xl">
        <Sidebar/>
        <Chat/>
        {/* <RightSide/> */}
      </div>
    </div>


  )
}

export default Home