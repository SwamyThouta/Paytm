"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Search from "./form/Search";
import { FaSearch } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { BsFillCartFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import Link from "next/link";
import Button from "../components/form/Button";
import { list as categorylist } from "@/service/category";
import { category } from "../../../types";
import { subcategory } from "../../../types";
import { sublist as subcategorieslist } from "@/service/subcategory";
import { subsubcategory } from "../../../types";
import { subsublist as subsubcategorieslist } from "@/service/subsubcategories";
import { useContext } from "react";
// import { CartDetailsContext } from "../cart/page";
import { Product } from "../../../types";
import {
  getCartList as cartList,
  cartDelete,
  updateQuantity,
} from "@/service/products";
export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  // const context = useContext(CartDetailsContext);
  const [categories, setCategories] = useState<category[]>([]);
  const [subCategories, setSubCategories] = useState<subcategory[]>([]);
  const [subsubCategories, setSubSubCategories] = useState<subsubcategory[]>(
    []
  );
  const [cartsList, setcartList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    subsubcategorieslist()
      .then((subsubcategories) => {
        if (subsubcategories == null) {
          setError("Unable to Fetch");
        } else {
          console.log("subsubCategories", subsubcategories);
          setSubSubCategories(subsubcategories);
        }
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  useEffect(() => {
    subcategorieslist()
      .then((subcategories) => {
        if (subcategories == null) {
          setError("Unable to Fetch");
        } else {
          console.log("usersubcategories", subcategories);
          setSubCategories(subcategories);
        }
      })
      .catch((e: any) => {
        setError(e.message);
      });
  }, []);
  let cartLength = cartsList.length;
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    const handleScroll = () => {
      closeModal();
      if (window.scrollY > 0) {
        setIsSearchVisible(true);
        setIsHeaderVisible(false);
      } else {
        setIsSearchVisible(false);
        setIsHeaderVisible(true);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isModalOpen]);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsSearchVisible(true);
      setIsHeaderVisible(false);
    } else {
      setIsSearchVisible(false);
      setIsHeaderVisible(true);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    categorylist()
      .then((categories) => {
        if (categories == null) {
          setError("Unable to Fetch");
        } else {
          setCategories(categories);
        }
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <>
      {isHeaderVisible && (
        <header className="bg-gray-900 text-white shadow-md sticky top-0 z-20 font-poppins">
          <div className="container mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <Image
                src="/e coomerce logo.png"
                width={60}
                height={50}
                alt="logo"
                className="rounded-md"
              />
            </div>
            <div className="relative flex-1 flex justify-center">
              <div className="relative w-96 border border-yellow-500 rounded-md">
                <Search
                  placeholder="Search"
                  id="search"
                  autocomplete={false}
                  className="text-white placeholder-gray-400 py-2 px-4 rounded-md w-full bg-gray-800"
                />
                <FaSearch className="absolute top-3 right-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button
                id=""
                title="LOGIN"
                className="bg-yellow-500 font-bold text-sm text-white py-2 px-4 rounded-md"
              />
              <Button
                id=""
                title="REGISTER"
                className="bg-yellow-500 text-sm text-white py-2 px-4 rounded-md"
              />
              <Link href="/wishlist" className="relative">
                <FcLike className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Link>
              <Link href="/cart" className="relative">
                <BsFillCartFill className="text-xl text-yellow-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartsList.length}
                </span>
              </Link>
              <Link href="/notifications" className="relative">
                <MdNotificationsNone className="text-xl text-gray-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
              </Link>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={toggleProfileDropdown}
                >
                  <span className="text-white text-sm font-bold">Profile</span>
                  <IoMdArrowDropdown className="text-white" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      <nav className="bg-yellow-500 py-2 sticky top-0 z-10 font-poppins">
        <ul className="flex justify-evenly font-bold text-sm text-gray-900 relative">
          <li className="flex items-center relative">
            <button
              className="bg-yellow-600 py-2 px-4 text-white rounded-md flex items-center"
              onClick={openModal}
            >
              Shop By Category <IoMdArrowDropdown className="ml-2" />
            </button>
            {isModalOpen && (
              <>
                {/* Overlay div */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-10"
                  onClick={closeModal}
                ></div>
                <div
                  style={{ width: "800px" }}
                  ref={modalRef}
                  className="absolute top-full left-0 mt-4 bg-white p-4 rounded-md shadow-lg grid grid-cols-3 gap-4 z-20"
                  onClick={(e) => e.stopPropagation()} // Stop propagation to prevent overlay from closing
                >
                  {categories && categories.length > 0 ? (
                    <div className="bg-red-100 p-4 rounded-md">
                      <ul>
                        {categories.map((category) => (
                          <li
                            key={category.id}
                            className="p-2 rounded-md hover:bg-red-200 transition-all"
                          >
                            <Link href={`/categories/${category.id}`}>
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Categories Not available</p>
                  )}
                  {subCategories && subCategories.length > 0 ? (
                    <div className="bg-blue-100 p-4 rounded-md">
                      <ul>
                        {subCategories.map((subcategory) => (
                          <li
                            key={subcategory.id}
                            className="p-2 rounded-md hover:bg-blue-200 transition-all"
                          >
                            <Link href={`/subcategory/${subcategory.id}`}>
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Subcategories Not available</p>
                  )}
                  {subsubCategories && subsubCategories.length > 0 ? (
                    <div className="bg-green-100 p-4 rounded-md">
                      <ul>
                        {subsubCategories.map((subsubcategory) => (
                          <li
                            key={subsubcategory.id}
                            className="p-2 rounded-md hover:bg-green-200 transition-all"
                          >
                            <Link href={`/subsubcategory/${subsubcategory.id}`}>
                              {subsubcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Sub-subcategories Not available</p>
                  )}
                </div>
              </>
            )}
          </li>
          {isSearchVisible && (
            <li className="flex items-center">
              <div className="relative w-96 mx-auto">
                <div className="relative border border-yellow-500 rounded-md p-1">
                  <Search
                    placeholder="Search"
                    id="search-nav"
                    autocomplete={false}
                    className="text-white placeholder-gray-400 py-2 px-4 rounded-md w-full border border-yellow-500 shadow-lg"
                  />
                  <FaSearch className="absolute top-4 right-3 text-yellow-500" />
                </div>
              </div>
              <Link href="/cart" className="relative ms-32">
                <BsFillCartFill className="text-xl text-white" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Link>
            </li>
          )}
          {!isSearchVisible && (
            <>
              <li className="flex items-center">
                Fresh Vegtables <IoMdArrowDropdown className="ml-2" />
              </li>
              <li className="flex items-center">
                Fresh Chicken <IoMdArrowDropdown className="ml-2" />
              </li>
              <li className="flex items-center">
                Eggs
                <IoMdArrowDropdown className="ml-2" />
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
