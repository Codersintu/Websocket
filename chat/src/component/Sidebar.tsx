import menu from "../assets/menu_icon.png";
import logo from "../assets/logo_icon.svg";
import img1 from "../assets/profile_marco.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import { useSetRecoilState } from "recoil";
import { openUser } from "../Atom";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Sidebar() {
  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const debouncedInput = useDebounce(input, 500);
  const setOpenUser=useSetRecoilState(openUser)
  // Fetch users when debounced input changes
  useEffect(() => {
    const fetchUsers = async (query: string) => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/search?query=${query}`,{
          headers:{
            Authorization:localStorage.getItem("token2")
          }
        });
        setResults(response.data.users || []);
        console.log(response.data.users)
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    fetchUsers(debouncedInput);
  }, [debouncedInput]);

  const handleLogout = () => {
    localStorage.removeItem("token2");
    navigate("/login");
  };

  return (
    <div className="flex-1 border px-4 py-4 flex flex-col gap-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img className="w-9 h-9" src={logo} alt="logo" />
          <h1 className="text-white text-xl font-semibold">ChintuChat</h1>
        </div>
        <div className="relative py-2 group">
          <img className="max-h-5 cursor-pointer" src={menu} alt="menu" />
          <div className="right-0 bg-[#282142] group-hover:block w-20 z-20 p-2 text-white hidden absolute rounded-md">
            <p className="font-semibold cursor-pointer" onClick={() => navigate("/profile")}>
              Profile
            </p>
            <hr className="bg-gray-400" />
            <p className="font-semibold cursor-pointer" onClick={handleLogout}>
              LogOut
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full px-3 py-1 rounded-2xl outline-none"
            type="text"
            placeholder="🔍 Search people..."
          />
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent h-[calc(100vh-200px)]">
          {results.length > 0 ? (
            results.map((user, i) => (
              <div className="flex flex-col gap-2 mb-4" key={i} onClick={()=>setOpenUser(user)}>
                <div className="flex items-center gap-2 cursor-pointer" >
                  <img className="border w-9 h-9 rounded-full" src={user.profileImg || img1} alt="" />
                  <p className="text-white">{user.username}</p>
                </div>
                <span className="border"></span>
              </div>
            ))
          ) : (
            Array.from({ length: 10 }).map((_, i) => (
              <div className="flex flex-col gap-2 mb-4" key={i}>
                <div className="flex items-center gap-2">
                  <img className="border w-9 h-9 rounded-full" src={img1} alt="" />
                  <p className="text-white">Sintu Kumar {i + 1}</p>
                </div>
                <span className="border"></span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
