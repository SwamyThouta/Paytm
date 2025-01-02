"use client";
import React, { useRef, useState } from "react";
import Input from "@/app/components/form/Input";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/service/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setPasswordShow] = useState(true);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const router = useRouter();

  const changePassword = () => {
    setPasswordShow((prevState) => !prevState);
  };
  const emailRef = useRef<HTMLInputElement>(null);
  const passWordRef = useRef<HTMLInputElement>(null);

  const loginSubmit = async () => {
    setErrorPassword("");
    setSuccessMsg("");
    setErrMsg("");

    const email = emailRef.current?.value || "";
    const password = passWordRef.current?.value || "";

    if (!email) {
      toast.error("Please enter Email");
      return;
    }

    if (!password) {
      toast.error("Please enter Password");
      return;
    }

    try {
      const loginResponse = await login({ email: email, password: password });
      console.log("loginResponse", loginResponse);
      // if (loginResponse && loginResponse.token) {
      //     localStorage.setItem('accessToken', loginResponse.token, );
      //     localStorage.setItem('id', loginResponse.id );
      //     console.log('msgggggggggggggggg', loginResponse.message)
      //     toast.success(loginResponse.message || "Login successful");
      //     setTimeout(() => {
      //         setSuccessMsg("");
      //         router.push("/admin/applicant");
      //     }, 1000);
      // }
      if (loginResponse) {
        // localStorage.setItem('accessToken', loginResponse.token, );
        // localStorage.setItem('id', loginResponse.id );
        // console.log('msgggggggggggggggg', loginResponse.message)
        toast.success(loginResponse.message || "Login successful");
        setTimeout(() => {
          setSuccessMsg("");
          router.push("/admin/applicant");
        }, 1000);
      } else {
        toast.error(
          loginResponse?.message || "An unexpected error occurred during login."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to login, please try again later."
      );
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      loginSubmit();
    }
  };

  const setError = (e: any) => {
    if (e.target.name == "email") {
      if (!emailRef.current?.value) {
        setErrorEmail("Please enter Email");
        return;
      } else {
        setErrorEmail("");
      }
    }

    if (e.target.name == "password") {
      if (!passWordRef.current?.value) {
        setErrorPassword("Please enter Password");
        return;
      } else {
        setErrorPassword("");
      }
    }
  };

  return (
    <div className='flex flex-col relative  items-center justify-center h-screen bg-cover bg-no-repeat bg-[url("/login_image.jpg")]'>
      <div className="shadow-white shadow-2xl bg-gray-200 rounded p-8 justify-center">
        <div className=" p-3 rounded flex justify-center ">
          {/* <Image
            src="/tvisha-logo.png"
            alt={"login"}
            height={200}
            width={200}
            className="shadow-white drop-shadow-2xl p-2"
          /> */}
        </div>

        {/* <h1 className='text-[28px] mb-7 font-bold'>Login</h1> */}

        <div className="row">
          <div className="mb-5">
            <label className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">
              Email Id
            </label>
            <div className="w-[60vh] ">
              <Input
                placeholder="Email Id"
                type="email"
                name="email"
                inputRef={emailRef}
                onChange={setError}
                className="bg-gray-50 border text-sm rounded-lg  w-full p-3  outline-none"
                onKeyPress={handleKeyPress}
              />
            </div>
            <span className="text-red-500">{errorEmail}</span>
          </div>

          <div className="mb-5 ">
            <label className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">
              Password
            </label>
            <div className="relative">
              <div className="w-[60vh]">
                <Input
                  placeholder="Password"
                  name="password"
                  inputRef={passWordRef}
                  onChange={setError}
                  type={showPassword ? "password" : "text"}
                  className=" bg-gray-50 border outline-none text-sm rounded-lg  w-full p-3   "
                  onKeyPress={handleKeyPress}
                />
              </div>
              <span className="text-red-500">{errorPassword}</span>
              <button
                onClick={changePassword}
                className="w-8 h-8 absolute top-2 right-0"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        {successMsg || errMsg ? (
          <div
            className={`text-center mb-4 ${
              successMsg ? "text-green-500" : "text-red-500"
            }`}
          >
            {successMsg || errMsg}
          </div>
        ) : null}

        <div className="mb-8 text-center">
          <button
            className="bg-black text-white rounded py-2 px-6 font-bold hover:bg-white hover:text-black"
            onClick={loginSubmit}
          >
            LOGIN
          </button>
        </div>
        <div className="text-right ">
          <Link
            href="forgot-password"
            className="text-black font-bold hover:text-blue-600 hover:underline"
          >
            {" "}
            Forgot Password?
          </Link>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
