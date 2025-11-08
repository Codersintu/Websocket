import backarr from "../assets/icons8-back-button-30.png"
import avtrr from "../assets/avatar_icon.png"
import { useNavigate } from "react-router-dom"
function Profile() {
  const navigate=useNavigate()
  return (
    <div className="w-full h-screen border sm:px-[20%] sm:py-[10%]">
      <div className="backdrop-blur-xl flex border-2 border-gray-600 shadow-2xl rounded-2xl h-[100%] p-5">
       <div className="flex h-10 items-center gap-3 ">
        <img className="w-8 h-8 cursor-pointer" onClick={()=>navigate('/')} src={backarr} alt="arr" />
        <p className="text-white">Profile Detail</p>
       </div>
       <div className="flex mt-10 w-full gap-4">
        <div className=" flex flex-col gap-5 flex-1">
          <div className="flex items-center gap-4">
            <img className="w-16 h-16" src={avtrr} alt="" />
            <p className="text-white">Upload Image...</p>
          </div>
          <div className="">
            <label className="text-white text-xl font-medium">Name</label>
            <input className="w-full border border-gray-600 outline-none bg-gray-700 py-2 px-5 text-white" type="text" value="sintu kumar" />
          </div>
          <div className="">
            <textarea className="w-full p-3 outline-none bg-gray-700 text-white"></textarea>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-around">
           <img className="w-32 h-32" src={avtrr} alt="" />
           <button className="text-white w-full py-2 bg-cyan-600 rounded-xl hover:bg-cyan-800">Logout</button>
        </div>
       </div>
      </div>

    </div>
  )
}

export default Profile