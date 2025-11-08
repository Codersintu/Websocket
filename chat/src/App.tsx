import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { RecoilRoot } from 'recoil';
import SignUp from "./pages/SignUp"
import Profile from './pages/Profile';
import { useEffect } from 'react';
function App() {
  const navigate=useNavigate()
  useEffect(() => {
    const token=localStorage.getItem("token2")
  // Only redirect if there's NO token and user isn't already on /login
  if (!token && window.location.pathname !== "/login") {
    navigate("/login");
  }else{
    navigate("/")
  }
}, []);



  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
    <RecoilRoot>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<SignUp/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Routes>
    </RecoilRoot>
    </div>
  );
}

export default App;
