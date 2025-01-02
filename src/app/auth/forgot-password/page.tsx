"use client";
import React, { useRef, useState } from "react";
// import Input from '@/app/components/Input'
import { forgotPassword } from "@/service/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPassword() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailErr, setEmailErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrMsg] = useState("");
  const sendOtp = async () => {
    if (emailRef.current?.value.trim() == "") {
      return setEmailErr("Please enter Email");
    }
    const response: any = await forgotPassword({
      email: emailRef.current?.value,
    });
    if (response) {
      if (response?.error) {
        setErrMsg(response.error?.message);
      } else {
        setSuccessMsg(response?.message);
        localStorage.setItem("token", response.token);
        localStorage.setItem("secretHex", response.otp.secretHex);
        console.log(response.otp.otp);
        setTimeout(() => {
          setErrMsg("");
          router.push("/auth/otp");
        }, 3000);
      }
    } else {
      setErrMsg("Something went wrong, Please try again later");
    }
  };

  const errMessages = () => {
    if (emailRef.current?.value.trim() == "") {
      setEmailErr("Please enter Email");
    } else {
      setEmailErr("");
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
        <span className="text-green-500">{successMsg}</span>
        <span className="text-red-500">{errorMsg}</span>

        <div className="row mt-4">
          <div className="">
            <label className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">
              Email Id
            </label>
            <div className="w-[50vh] ">
              {/* <Input
                placeholder="Email Id"
                name="email"
                onChange={errMessages}
                inputRef={emailRef}
                className="bg-gray-50 border text-sm rounded-lg  w-full p-3  outline-none"
              /> */}
            </div>
            <span className="text-red-500">{emailErr}</span>
          </div>
        </div>
        <div className=" mt-4 text-center">
          <button
            className="bg-black text-white rounded py-2 px-6 font-bold hover:bg-white hover:text-black"
            onClick={sendOtp}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
