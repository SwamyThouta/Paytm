import React from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
import TextInput from "./form/TextInput";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-yellow-500 uppercase text-sm font-bold mb-4">
              My Profile
            </h2>
            <ul>
              <li className="mb-2 hover:text-yellow-500">Getting Started</li>
              <li className="mb-2 hover:text-yellow-500">FAQs</li>
              <li className="mb-2 hover:text-yellow-500">Buying Guide</li>
              <li className="mb-2 hover:text-yellow-500">Order Returns</li>
              <li className="mb-2 hover:text-yellow-500">Affiliate Program</li>
            </ul>
          </div>
          <div>
            <h2 className="text-yellow-500 uppercase text-sm font-bold mb-4">
              Your Account
            </h2>
            <ul>
              <li className="mb-2 hover:text-yellow-500">Your Account</li>
              <li className="mb-2 hover:text-yellow-500">FAQs</li>
              <li className="mb-2 hover:text-yellow-500">Buying Guide</li>
              <li className="mb-2 hover:text-yellow-500">Order Returns</li>
              <li className="mb-2 hover:text-yellow-500">Affiliate Program</li>
            </ul>
          </div>
          <div>
            <h2 className="text-yellow-500 uppercase text-sm font-bold mb-4">
              Customer Care
            </h2>
            <ul>
              <li className="mb-2 hover:text-yellow-500">Customer Care</li>
              <li className="mb-2 hover:text-yellow-500">FAQs</li>
              <li className="mb-2 hover:text-yellow-500">Buying Guide</li>
              <li className="mb-2 hover:text-yellow-500">Order Returns</li>
              <li className="mb-2 hover:text-yellow-500">Affiliate Program</li>
            </ul>
          </div>
          <div>
            <h2 className="text-yellow-500 uppercase text-sm font-bold mb-4">
              Contact Details
            </h2>
            <div className="mb-4">
              <p className="text-lg font-light">
                <span className="font-bold">Telephone:</span> 012345-6789
              </p>
              <p className="text-lg font-light">
                <span className="font-bold">Email:</span> tvisha@gmail.com
              </p>
            </div>
            <ul>
              <li className="mb-2 hover:text-yellow-500">Order Returns</li>
              <li className="mb-2 hover:text-yellow-500">Affiliate Program</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/e coomerce logo.png"
              width={100}
              height={100}
              alt="logo"
            />
          </div>
          <div className="flex justify-center md:justify-start lg:col-span-2">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="text-2xl bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  className="text-2xl bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                >
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="text-2xl bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                >
                  <AiFillInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  className="text-2xl bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                >
                  <FaYoutube />
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <p className="text-center md:text-left mb-4">
              Get special offers & news of the latest fashion styles
            </p>
            <div className="relative w-full">
              <TextInput
                placeholder="Email"
                id="email"
                autocomplete={false}
                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 outline-none"
              />
              <button className="absolute top-1/2 transform -translate-y-1/2 right-3 bg-yellow-500 p-2 rounded-full hover:bg-yellow-600">
                <SiMinutemailer className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
