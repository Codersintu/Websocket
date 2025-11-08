import { useRef, useState } from 'react'
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { emailAtom, passwordAtom, registerAtom } from '../Atom';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../Config';

import avtrr from "../assets/avatar_icon.png"
import imageCompression from 'browser-image-compression';

function SignUp() {
  const isRegistered = useRecoilValue(registerAtom)
  const setIsRegistered = useSetRecoilState(registerAtom)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef(null)
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setEmail = useSetRecoilState(emailAtom)
  const setPassword = useSetRecoilState(passwordAtom)
  const email = useRecoilValue(emailAtom)
  const password = useRecoilValue(passwordAtom)
  const [loadable, setloadable] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  async function signup(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!file) return;
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    })
    setloadable(true)
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("file", compressedFile)
    formData.append("email", email || "")
    formData.append("password", password || "")
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, formData);
      setIsRegistered(true)
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setloadable(false)
    }
  }

  // ----------- Signin Handler -----------

  async function SigninHandler(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
    setloadable(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
        email,
        password,
      });

      const token2 = response.data.token2;
      if (token2) {
        localStorage.setItem("token2", token2); // store token
      }
      navigate("/")

    } catch (error: any) {
      alert(error.response?.data?.message || "Signin failed");
    } finally {
      setloadable(false)
    }
  }

  return (
    <div className="md:flex-row flex flex-col  min-h-screen gap-10">
      <div className="flex flex-1 items-center justify-center min-h-screen"  >
        <div className="border backdrop-blur-xl p-6 rounded-2xl shadow-lg w-96">
          {isRegistered ? (
            // ----------- Login Form -----------
            <div>
              <h2 className="text-2xl text-center font-medium text-cyan-400 mb-6 ">Login to ChintuChat App</h2>
              <form className="space-y-4">
                <input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <button
                  onClick={SigninHandler}
                  type="submit"
                  className={`w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 ${loadable ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loadable ? "Loading🏃‍♂️‍➡️..." : "Login"}
                </button>
              </form>
              <p className="text-center text-white mt-4">
                Don’t have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-semibold"
                  onClick={() => setIsRegistered(false)}
                >
                  Register
                </span>
              </p>
            </div>
          ) : (
            // ----------- Register Form -----------
            <div>
              <h2 className="text-2xl font-semibold text-center mb-6 text-cyan-400">SignUp to ChintuChat App</h2>
              <form className="space-y-4">
                <div id='prImg' className="w-full flex justify-center">
                  <label htmlFor="uploadImg" >
                    <img
                      className="w-28 h-28 cursor-pointer rounded-full border-2 border-cyan-500 hover:opacity-80 transition"
                      src={preview || avtrr}
                      alt="Profile"
                    />
                  </label>
                  <input ref={fileRef} className="hidden" onChange={handleChange} type="file" id="uploadImg" />
                </div>
                <input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <button
                  onClick={signup}
                  type="submit"
                  disabled={loadable}
                  className={`w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 ${loadable ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loadable ? "Loading🏃‍♂️‍➡️..." : "Sign Up"}
                </button>
              </form>
              <p className="text-center mt-4 text-white">
                Do you have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-semibold"
                  onClick={() => setIsRegistered(true)}
                >
                  Login
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUp;