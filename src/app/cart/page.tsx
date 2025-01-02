"use client";
import Header from "../components/Header";
import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegBookmark, FaHome } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import {
  getCartList as cartList,
  cartDelete,
  updateQuantity,
} from "@/service/products";
import { Product } from "../../../types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiTwotoneDelete } from "react-icons/ai";
// type CartDetailsContextType = {
//   cartlength: number;
// };
// export let CartDetailsContext = React.createContext<
//   CartDetailsContextType | undefined
// >(undefined);
export default function Cart() {
  const [cartsList, setcartList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartData = await cartList(3);
        setcartList(Array.isArray(cartData) ? cartData : [cartData]);
        setLoading(false);
      } catch (error) {
        setError("Error fetching product data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  let cartLength = cartsList.length;
  console.log("cartsList", cartsList.length);
  const calculateSubtotal = (item: Product) => {
    return item?.variant?.[0]?.price * item.quantity || 0;
  };

  const calculateTotal = () => {
    if (!cartsList) return 0;
    return cartsList.reduce(
      (total, item) => total + calculateSubtotal(item),
      0
    );
  };

  const handleIncrement = async (index: number, id: number) => {
    const updatedCart = [...cartsList];
    updatedCart[index].quantity++;
    await updateQuantity(updatedCart[index].quantity, id);
    setcartList(updatedCart);
  };

  const handleDecrement = async (index: number) => {
    const updatedCart = [...cartsList];
    const updatedQuantity = Math.max(0, updatedCart[index].quantity - 1);
    updatedCart[index].quantity = updatedQuantity;
    setcartList(updatedCart);

    if (updatedQuantity === 0) {
      const cartIdToDelete = updatedCart[index].id;
      if (cartIdToDelete) {
        try {
          const categoryDelete = await cartDelete(cartIdToDelete);
          if (categoryDelete) {
            const updatedCartList = updatedCart.filter(
              (item) => item.id !== cartIdToDelete
            );
            setcartList(updatedCartList);
          }
        } catch (error) {
          console.error("Error deleting cart item:", error);
          toast.error("Error deleting cart item");
        }
      }
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center space-x-2 text-gray-600 mb-4">
        <Link key="home" href="/products">
          <p className="text-yellow-500 hover:text-yellow-700 flex items-center">
            <FaHome className="inline mr-2" />
            Home
          </p>
        </Link>
        <>
          <span key="sep1" className="mx-2 text-gray-500">
            /
          </span>
          <Link key="category" href={`/categories`}>
            <p className="text-yellow-500 hover:text-yellow-700 underline font-bold">
              Cart
            </p>
          </Link>
        </>
      </div>
    );
  };

  const handleDelete = async (index: number) => {
    const cartIdToDelete = cartsList[index].id;
    if (cartIdToDelete) {
      try {
        const categoryDelete = await cartDelete(cartIdToDelete);
        if (categoryDelete) {
          const updatedCartList = cartsList.filter(
            (item) => item.id !== cartIdToDelete
          );
          setcartList(updatedCartList);
          toast("Item deleted from cart", {
            type: "info",
            theme: "colored",
            position: "top-right",
            autoClose: 1000,
          });
          // toast.success();
        }
      } catch (error) {
        console.error("Error deleting cart item:", error);
        toast.error("Error deleting cart item");
      }
    }
  };

  const handleSaveForLater = (index: number) => {
    // Implement the logic for saving the item for later
    toast.info("Save for later functionality to be implemented");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {/* <CartDetailsContext.Provider value={{ cartlength: cartLength }}> */}
      <nav className="text-sm mb-4 mt-2 ms-20">{renderBreadcrumbs()}</nav>
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <p>Loading...</p>
        </div>
      ) : cartsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow py-10">
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            Your cart is empty
          </p>
          <Link href="/products">
            <p className="text-yellow-500 hover:text-yellow-700 flex items-center">
              <FaHome className="inline mr-2" />
              Go to Products
            </p>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row justify-around items-start mx-4 md:mx-10 lg:mx-20">
          <div className="w-full lg:w-3/5 p-4 mb-4 bg-white shadow-md border border-gray-300 rounded-md">
            <div className="hidden lg:grid grid-cols-3 py-2">
              <div className="text-xl leading-8 text-black font-bold">
                Product
              </div>
              <div className="text-xl leading-8 text-black font-bold">
                Quantity
              </div>
              <div className="text-xl leading-8 text-black font-bold text-right">
                Total
              </div>
            </div>
            {cartsList?.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-gray-300 py-2"
              >
                <div className="flex items-center flex-col lg:flex-row  lg:gap-6 w-full">
                  <div className="img-box">
                    <Image
                      alt="product image"
                      width={100}
                      height={100}
                      className="object-cover border rounded-md"
                      src={`https://s3.us-east-1.amazonaws.com/tvishatest/${item?.image?.[0]?.original}`}
                      loader={() =>
                        `https://s3.us-east-1.amazonaws.com/tvishatest/${item?.image?.[0]?.original}`
                      }
                    />
                  </div>
                  <div className="pro-data w-full max-w-sm">
                    <h5 className="font-semibold text-xl leading-8 text-black text-center lg:text-left">
                      {item?.product_name}
                    </h5>
                    <h6 className="font-medium text-lg leading-8 text-black text-center lg:text-left flex">
                      <span className="block font-bold">&#8377;</span>
                      {item?.variant?.[0]?.price || 0}
                    </h6>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <button
                    onClick={() => handleDecrement(index)}
                    className="rounded-full bg-gray-200 p-2 transition-all duration-500 hover:bg-gray-300"
                  >
                    <svg
                      className="stroke-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M16.5 11H5.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="outline-none text-gray-900 font-semibold text-lg w-full max-w-[60px] p-1 min-w-[20px] text-center bg-transparent"
                  />
                  <button
                    onClick={() => handleIncrement(index, item.id)}
                    className="rounded-full bg-gray-200 p-2 transition-all duration-500 hover:bg-gray-300"
                  >
                    <svg
                      className="stroke-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M11 5.5V16.5M16.5 11H5.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center justify-center gap-2 lg:ml-4 mb-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-3 py-2 border border-red-500 text-red-500 rounded-full transition-all duration-500 hover:bg-red-50"
                    >
                      <AiTwotoneDelete />
                    </button>
                    <button
                      onClick={() => handleSaveForLater(index)}
                      className="px-3 py-2 border border-blue-500 text-blue-500 rounded-full transition-all duration-500 hover:bg-blue-50"
                    >
                      <FaBookmark />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between lg:justify-end w-full lg:w-auto mt-4 lg:mt-0">
                  <h6 className="text-black font-manrope font-bold text-lg leading-9 w-full text-center lg:text-right flex justify-end">
                    <span className="block font-bold">&#8377;</span>
                    {calculateSubtotal(item)}
                  </h6>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white w-full lg:w-1/3 p-4 border border-gray-300 rounded-md shadow-md mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between w-full mb-4">
                <p className="font-normal text-xl leading-8 text-gray-400">
                  Sub Total
                </p>
                <h6 className="font-semibold text-lg leading-8 text-gray-900 flex">
                  <span className="block font-bold">&#8377;</span>{" "}
                  {calculateTotal()}
                </h6>
              </div>
              <div className="flex items-center justify-between w-full py-3 border-b border-gray-200">
                <p className="font-manrope font-medium text-2xl leading-9 text-gray-900">
                  Total
                </p>
                <h6 className="font-manrope font-medium text-xl leading-9 text-black flex">
                  <span className="block font-bold">&#8377;</span>
                  {calculateTotal()}
                </h6>
              </div>
              <div className="flex items-center flex-col justify-center gap-3 mt-8">
                <button className="rounded-full w-full max-w-[250px] py-2 text-center justify-center items-center bg-yellow-500 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-yellow-600">
                  Continue to Payment
                  <svg
                    className="ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <path
                      d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <ToastContainer />
      {/* </CartDetailsContext.Provider> */}
    </div>
  );
}
