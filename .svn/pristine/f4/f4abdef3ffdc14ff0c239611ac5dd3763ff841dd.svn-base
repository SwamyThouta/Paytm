
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import Search from "../components/form/Search";
import Link from "next/link"
import { AiFillStar } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
export default async function Post() {

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex items-center justify-between "> 
            
             <div className=" text-3xl font-bold  ms-96 mt-4  text-amber-500 "> MY WISHLIST()</div>
                <div className="relative">
                    <input
                        placeholder={"Search"}
                        id={"search"}
                        className="py-1 px-5 placeholder:text-[#363636] placeholder:text-xs w-full outline-none my-custom-input"
                        autoComplete="false"
                    />
                    <FaSearch className="absolute top-2 right-3 text-[#8c969b]" />
                </div>
                <div>
                </div>
            </div>
            <div className="flex items-center justify-center ">
                <div className="relative w-[1000px] h-[250px] bg-white shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-2 mb-10 mt-4">
                    <div className="absolute top-2 right-2">
                        <div className="rounded-full  p-2 bg-amber-500">
                            <RiDeleteBin6Line className="text-white" />
                        </div>
                    </div>
                    <div className="flex">
                        <div>
                            <Link href="/">
                                <Image width={165} height={200} src="/wishlist.jpg" alt="wishlist-image" className="object-cover" />
                            </Link>
                        </div>
                        <div className="ms-4">
                            <h2 className="text-base font-medium mt-4">RG DesignsBlue & White Plain Cotton Kurta</h2>
                            <span className="flex mt-4 text-orange-400">
                                <AiFillStar className="font-semibold" />
                                <AiFillStar />
                                <AiFillStar />
                                <AiFillStar />
                                <AiFillStar />
                                <span className="text-sm underline-offset-4 ms-4 text-blue-400 font-light">323 Review(s)</span>
                            </span>
                            <span className="flex mt-2">
                                <p className="text-red-600">&#36; 185.00</p>
                                <span className="line-through text-sm mt-1 ms-4">220.00</span>
                            </span>
                            <button className="bg-amber-600 mt-6  text-black font-bold py-2 px-4 rounded-full flex p-4">
                                <FaShoppingCart className="me-2 mt-1" />
                                <span>ADD TO CART</span>
                            </button>
                            <p className="font-light text-sm  mt-4"> Item added 23 March 2018</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex items-center justify-center ">
                <div className="relative w-[1000px] h-[250px] bg-white shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-2 mb-10 mt-4">
                    <div className="absolute top-2 right-2">
                        <div className="rounded-full  p-2 bg-amber-600">
                            <RiDeleteBin6Line className="text-white" />
                        </div>
                    </div>
                    <div className="flex">
                        <div>
                            <Link href="/">
                                <Image width={165} height={200} src="/wishlist.jpg" alt="wishlist-image" className="object-cover" />
                            </Link>
                        </div>
                        <div className="ms-4">
                            <h2 className="text-base font-medium mt-4">RG DesignsBlue & White Plain Cotton Kurta</h2>
                            <span className="flex mt-4 text-orange-400">
                                <AiFillStar className="font-semibold" />
                                <AiFillStar />
                                <AiFillStar />
                                <AiFillStar />
                                <AiFillStar />
                                <span className="text-sm underline-offset-4 ms-4 text-blue-400 font-light">323 Review(s)</span>
                            </span>
                            <span className="flex mt-2">
                                <p className="text-red-600">&#36; 185.00</p>
                                <span className="line-through text-sm mt-1 ms-4">220.00</span>
                            </span>
                            <button className="bg-amber-600 mt-6 text-black  font-bold py-2 px-4 rounded-full flex p-4">
                                <FaShoppingCart className="me-2 mt-1" />
                                <span>ADD TO CART</span>
                            </button>
                            <p className="font-light text-sm mt-4"> Item added 23 March 2018</p>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );

}