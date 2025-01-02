"use client";
import React, { useRef, useState } from "react";
// import Input from '@/app/components/Input'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { updatePassword } from "@/service/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const [showPassword, setNewPasswordShow] = useState(true);
  const [showCfmPassword, setCfmPasswordShow] = useState(true);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [errorNewPsw, setNewPsw] = useState("");
  const [errorCfmPsw, setCfmPsw] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();
  const changeNewPassword = () => {
    setNewPasswordShow((prevState) => !prevState);
  };
  const changeCfmPassword = async () => {
    setCfmPasswordShow((prevState) => !prevState);
  };
  const resetPassword = async () => {
    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    if (!newPassword) {
      toast.error("Please enter New Password");
      return;
    }
    if (!confirmPassword) {
      toast.error("Please enter Confirm Password");
      return;
    }

    if (newPassword != confirmPassword) {
      toast.error("confirm Password must be match with New Password ");
      return;
    }

    const response: any = await updatePassword({
      password: newPassword,
      confirm_password: confirmPassword,
    });
    console.log("response", response);

    if (response) {
      if (response?.error) {
        toast.error(response.error?.message);
      } else {
        toast.success(response?.message);
        setTimeout(() => {
          setSuccessMsg("");
          router.push("/auth/login");
        }, 1000);
      }
    } else {
      toast.error("Something went wrong, Please try again later");
    }
  };

  const setError = (e: any) => {
    if (e.target.name == "newpsw") {
      if (!newPasswordRef.current?.value) {
        toast.error("Please enter New Password");
        return;
      }
    }

    if (e.target.name == "cfmPsw") {
      if (!confirmPasswordRef.current?.value) {
        toast.error("Please enter Confirm Password");
        return;
      }
    }
  };
  return (
    <div className='flex flex-col relative  items-center justify-center h-screen bg-cover bg-no-repeat bg-[url("/login_image.jpg")]'>
      <div className="shadow-white shadow-2xl bg-gray-200 rounded p-8 justify-center">
        <div className=" p-3 rounded flex justify-center ">
          <Image
            src="/tvisha-logo.png"
            alt={"login"}
            height={200}
            width={200}
            className="shadow-white drop-shadow-2xl p-2"
          />
        </div>

        {/* <h1 className='text-[28px] mb-7 font-bold'>Login</h1> */}

        <div className="row">
          <div className="mb-5">
            <label className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">
              Password
            </label>
            <div className="relative">
              {/* <div className='w-[60vh] '>
                                <Input placeholder='Password' name='newpsw' onChange={setError} inputRef={newPasswordRef} type={showPassword ? 'password' : 'text'} className='bg-gray-50 border text-sm rounded-lg  w-full p-3  outline-none' />
                                <button onClick={changeNewPassword} className='w-8 h-8 absolute top-2 right-0' >

                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (<FaEye />)
                                    }
                                </button>
                            </div> */}
            </div>
            <span className="text-red-500">{errorNewPsw}</span>
          </div>

          <div className="mb-5 ">
            <label className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">
              Confirm Password
            </label>
            <div className="relative">
              {/* <div className='w-[60vh]'>
                                <Input placeholder='Password' name='cfmPsw' inputRef={confirmPasswordRef} onChange={setError} type={showCfmPassword ? 'password' : 'text'} className=' bg-gray-50 border outline-none text-sm rounded-lg  w-full p-3  ' />
                                <button onClick={changeCfmPassword} className='w-8 h-8 absolute  top-2 right-0' >

                                    {showCfmPassword ? (
                                        <FaEyeSlash />
                                    ) : (<FaEye />)
                                    }
                                </button>
                            </div> */}
              <span className="text-red-500">{errorCfmPsw}</span>
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

        <div className="mb-8 mt-8 text-center">
          <button
            className="bg-black text-white rounded py-2 px-6 font-bold hover:bg-white hover:text-black"
            onClick={resetPassword}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>

    // <div className='flex flex-col relative  items-center justify-center h-screen'>

    //     <span className='text-red-500'>{errMsg}</span>
    //     <span className='text-green-500'>{successMsg}</span>
    //     <h1 className='text-[28px] mb-7 font-bold'>Reset Password</h1>
    //     <div className='row'>

    //         <div className='mb-5 '>
    //             <label className="block mb-2 text-[25px] font-semibold text-gray-900 dark:text-white">New Password</label>
    //             <div className='relative'>
    //                 <div className='w-[60vh]'>
    //                     <Input placeholder='Password' name='newpsw' onChange={setError} inputRef={newPasswordRef} type={showPassword ? 'password' : 'text'} className=' bg-gray-50 border border-gray-300 text-sm rounded-lg  w-full p-6 outline hover:outline-gray-300 ' />
    //                 </div>
    //                 <button onClick={changeNewPassword} className='w-8 h-8 absolute top-4 right-0' >

    //                     {showPassword ? (
    //                         <FaEyeSlash />
    //                     ) : (<FaEye />)
    //                     }
    //                 </button>
    //             </div>

    //             <span className='text-red-500'>{errorNewPsw}</span>

    //         </div>
    //         <div className='mb-5 '>
    //             <label className="block mb-2 text-[25px] font-semibold text-gray-900 dark:text-white">Confirm Password</label>
    //             <div className='relative'>
    //                 <div className='w-[60vh]'>
    //                     <Input placeholder='Password' name='cfmPsw' inputRef={cfmPswRef} onChange={setError} type={showCfmPassword ? 'password' : 'text'} className=' bg-gray-50 border border-gray-300 text-sm rounded-lg  w-full p-6 outline hover:outline-gray-300 ' />
    //                 </div>
    //                 <button onClick={changeCfmPassword} className='w-8 h-8 absolute  top-4 right-0' >

    //                     {showCfmPassword ? (
    //                         <FaEyeSlash />
    //                     ) : (<FaEye />)
    //                     }
    //                 </button>
    //             </div>

    //             <span className='text-red-500'>{errorCfmPsw}</span>

    //         </div>

    //     </div>
    //     <div className='mb-8'>
    //         <button className='bg-gray-400 px-20 py-4 mt-5 text-lg rounded-sm font-bold' onClick={resetPassword} >SUBMIT</button>

    //     </div>

    // </div>
  );
}
