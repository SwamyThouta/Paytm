"use client";
import React, { useRef, useState } from "react";
// import Input from '@/app/components/Input'
import { verifyOtp, forgotPassword } from "@/service/auth";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import Image from "next/image";

export default function Otp() {
  const one = useRef<HTMLInputElement>(null);
  const two = useRef<HTMLInputElement>(null);
  const three = useRef<HTMLInputElement>(null);
  const four = useRef<HTMLInputElement>(null);
  const five = useRef<HTMLInputElement>(null);
  const six = useRef<HTMLInputElement>(null);
  const [inputs, setInputs] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();
  const chnageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "one" && one.current?.value.trim() != "") {
      two.current?.focus();
    }
    if (e.target.name == "two") {
      three.current?.focus();
    }
    if (e.target.name == "three") {
      four.current?.focus();
    }
    if (e.target.name == "four") {
      five.current?.focus();
    }
    if (e.target.name == "five") {
      six.current?.focus();
    }

    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  function encryptOTP(otp: string, secretHex: string) {
    const key = Buffer.from(secretHex, "hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    let encryptedOTP = cipher.update(otp.toString(), "utf-8", "hex");
    encryptedOTP += cipher.final("hex");
    const encryptedData = iv.toString("hex") + encryptedOTP;
    return encryptedData;
  }

  const otpSubmit = async () => {
    if (
      inputs.one === "" ||
      inputs.two === "" ||
      inputs.three === "" ||
      inputs.four === "" ||
      inputs.five === "" ||
      inputs.six === ""
    ) {
      setShowError(true);
    } else {
      setShowError(false);
    }
    const otp = Object.values(inputs).join("");
    const secret = localStorage.getItem("secretHex") || "";
    console.log(otp);
    // console.log(encryptOTP(otp ,secret))
    const response = await verifyOtp({ otp: otp });
    if (response) {
      setSuccessMsg("Otp Verified Successfully");
      setTimeout(() => {
        router.push("/auth/update-password");
      }, 1000);
    } else {
      setErrMsg("Something went wrong");
    }
  };

  const resendOtp = async () => {
    const email = "";
    const response = await forgotPassword({ email: email });
    if (response) {
      setSuccessMsg("Otp Sent Successfully ");
      setTimeout(() => {
        setSuccessMsg("");
      }, 1000);
    } else {
      setErrMsg("Something went wrong");
      setTimeout(() => {
        setErrMsg("");
      }, 1000);
    }
  };
  return (
    <div className='flex flex-col  w-full  items-center justify-center h-screen bg-cover bg-no-repeat bg-[url("/login_image.jpg")]'>
      <div className="shadow-white shadow-2xl  rounded p-8 justify-center">
        <div className=" p-3 rounded flex justify-center ">
          <Image
            src="/tvisha-logo.png"
            alt={"login"}
            height={200}
            width={200}
            className="shadow-white drop-shadow-2xl p-2"
          />
        </div>
        {/* <img src='' /> */}

        <span className="text-green-500">{successMsg}</span>
        <span className="text-red-500">{errMsg}</span>

        {/* <div className='mt-4'>
                    <div className=''>
                        <label className="block text-[20px] font-semibold text-gray-900 dark:text-white">OTP Verification</label>
                        <div className="flex flex-row justify-between mt-4">
                            <div className=" ">
                                <Input inputRef={one} name="one" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl border  ${showError && !inputs.one && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                            <div className=" ">
                                <Input inputRef={two} name="two" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl  border ${showError && !inputs.two && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                            <div className=" ">
                                <Input inputRef={three} name="three" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl border ${showError && !inputs.three && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                            <div className=" ">
                                <Input inputRef={four} name="four" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl border ${showError && !inputs.four && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                            <div className=" ">
                                <Input inputRef={five} name="five" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl border ${showError && !inputs.three && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                            <div className=" ">
                                <Input inputRef={six} name="six" onChange={chnageInput} className={`w-10 h-10 text-center px-5 mr-2 outline-none rounded-xl border ${showError && !inputs.four && 'border-red-500'} border-gray-200 text-lg bg-white focus:bg-gray-50 `} maxLength={1} />
                            </div>
                        </div>
                    </div>
                </div> */}

        <div className=" mt-4 text-center">
          <button
            className="bg-black text-white rounded py-2 px-6 font-bold hover:bg-white hover:text-black"
            onClick={otpSubmit}
          >
            SUBMIT
          </button>
        </div>
        <button
          className="text-black hover:text-blue-600 hover:underline float-end mt-4"
          onClick={resendOtp}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
