"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "@/app/components/Header";
import {
  addtoCart,
  cartDelete,
  updateQuantity,
} from "../../../service/products";
import { getCartList as cartList } from "@/service/products";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { list as productList } from "@/service/products";
import { FaBookmark } from "react-icons/fa";
import { Product } from "../../../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FcPrevious, FcNext } from "react-icons/fc";

interface Variant {
  pack: string;
  price: number;
  in_cart: boolean;
  cart_id: number | null;
}

interface CartItem {
  id: number; // Unique ID for the cart item in the database
  productId: number;
  variant: Variant;
  quantity: number;
}

export default function ProductList() {
  const [isOpenList, setIsOpenList] = useState<boolean[]>([]);
  const [selectedVariantList, setSelectedVariantList] = useState<Variant[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [highlightNext, setHighlightNext] = useState<boolean>(false);
  const [highlightPrevious, setHighlightPrevious] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const productsPerPage = 4;

  // Fetch cart data on page load
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await cartList(3);
        setCartItems(Array.isArray(cartData) ? cartData : [cartData]);
      } catch (error) {
        setError("Error fetching cart data");
      }
    };
    fetchCartData();
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productList();
        if (products.length === 0) {
          setError("Unable to Fetch");
        } else {
          setProductsList(products);
          setIsOpenList(Array(products.length).fill(false));
          setSelectedVariantList(products.map((product) => product.variant[0]));
          setDisplayedProducts(products.slice(0, productsPerPage));
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setIsOpenList(Array(isOpenList.length).fill(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenList]);

  function toggleDropdown(index: number) {
    setIsOpenList((prevIsOpenList) => {
      const updatedIsOpenList = [...prevIsOpenList];
      updatedIsOpenList.forEach((isOpen, i) => {
        if (i !== index) {
          updatedIsOpenList[i] = false;
        }
      });
      updatedIsOpenList[index] = !updatedIsOpenList[index];
      return updatedIsOpenList;
    });
  }

  function selectVariant(variant: Variant, index: number) {
    setSelectedVariantList((prevSelectedVariantList) => {
      const updatedSelectedVariantList = [...prevSelectedVariantList];
      updatedSelectedVariantList[index] = variant;
      return updatedSelectedVariantList;
    });

    toggleDropdown(index);
  }

  const handleShowAll = () => {
    setShowAll(true);
    setDisplayedProducts(productsList);
    setHighlightNext(false);
    setHighlightPrevious(false);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + productsPerPage;
    setCurrentIndex(nextIndex);
    setDisplayedProducts(
      productsList.slice(nextIndex, nextIndex + productsPerPage)
    );
    setHighlightNext(true);
    setHighlightPrevious(false);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex - productsPerPage;
    setCurrentIndex(prevIndex);
    setDisplayedProducts(
      productsList.slice(prevIndex, prevIndex + productsPerPage)
    );
    setHighlightNext(false);
    setHighlightPrevious(true);
  };

  const handleAddToCart = async (productId: number, variant: Variant) => {
    if (!variant) {
      toast.error("Please Select a Pack.");
      return;
    }

    // Check if the variant is already in the cart
    const existingCartItemIndex = cartItems.findIndex(
      (item) =>
        item.productId === productId && item.variant.pack === variant.pack
    );

    if (existingCartItemIndex !== -1) {
      // If the variant is already in the cart, increment its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
      await updateQuantity(
        updatedCartItems[existingCartItemIndex].quantity,
        updatedCartItems[existingCartItemIndex].id
      );
      toast("Item quantity updated", {
        type: "success",
        theme: "colored",
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    try {
      const response = await addtoCart({
        guest_id: 1,
        user_id: 3,
        product_id: productId,
        quantity: 1,
        variant: [variant],
      });

      if (response.status === 200) {
        toast("Item added to cart", {
          type: "success",
          theme: "colored",
          position: "top-right",
          autoClose: 1000,
        });
        setCartItems((prevCartItems) => [
          ...prevCartItems,
          {
            id: response.data.id,
            productId,
            variant,
            quantity: 1,
          },
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  const handleIncrement = async (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity++;
    await updateQuantity(updatedCart[index].quantity, updatedCart[index].id);
    setCartItems(updatedCart);
  };

  const handleDecrement = async (index: number) => {
    const updatedCart = [...cartItems];
    const updatedQuantity = Math.max(0, updatedCart[index].quantity - 1);
    updatedCart[index].quantity = updatedQuantity;
    setCartItems(updatedCart);

    if (updatedQuantity === 0) {
      const cartIdToDelete = updatedCart[index].id;
      if (cartIdToDelete) {
        try {
          const categoryDelete = await cartDelete(cartIdToDelete);
          if (categoryDelete) {
            toast.success("Item deleted from cart");
            const updatedCartList = updatedCart.filter(
              (item) => item.id !== cartIdToDelete
            );
            setCartItems(updatedCartList);
          }
        } catch (error) {
          console.error("Error deleting cart item:", error);
          toast.error("Error deleting cart item");
        }
      }
    }
  };

  const handleDelete = async (index: number) => {
    const cartItemId = cartItems[index].id;

    try {
      await cartDelete(cartItemId);
      const updatedCartItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCartItems);
      toast("Item deleted from cart", {
        type: "info",
        theme: "colored",
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("Failed to remove item from cart.");
    }
  };

  const handleSaveForLater = (index: number) => {
    toast("Item saved for later", {
      type: "info",
      theme: "colored",
      position: "top-right",
      autoClose: 1000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <Header />
      <div className="flex justify-end items-center mt-5 px-4 mb-2">
        <button
          onClick={handleShowAll}
          className={`bg-yellow-500 text-white hover:bg-yellow-400 rounded-full py-2 px-6 mr-2 ${
            showAll ? "bg-yellow-600" : ""
          }`}
        >
          Show All
        </button>
        <button
          onClick={handlePrevious}
          className={`bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full py-2 px-4 mr-2 ${
            highlightPrevious ? "bg-gray-400" : ""
          }`}
          disabled={currentIndex === 0}
        >
          <FcPrevious />
        </button>
        <button
          onClick={handleNext}
          className={`bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full py-2 px-4 ${
            highlightNext ? "bg-gray-400" : ""
          }`}
          disabled={currentIndex + productsPerPage >= productsList.length}
        >
          <FcNext />
        </button>
      </div>
      <div className="flex justify-center items-center mt-5 px-6 mb-10 bg-gradient-to-b from-gray-50 to-gray-200 py-4 rounded-lg shadow-md">
        {loading ? (
          <div className="text-gray-700 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : displayedProducts && displayedProducts.length > 0 ? (
          <div className="w-full max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => {
                const selectedVariant = selectedVariantList[index];

                const cartItemIndex = cartItems.findIndex(
                  (item) =>
                    item.productId === product.id &&
                    item.variant.pack === selectedVariant?.pack
                );

                return (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                    ref={(el) => (dropdownRefs.current[index] = el)}
                  >
                    <Link
                      href={`/products/${product.id}`}
                      onClick={(e) => isOpenList[index] && e.preventDefault()}
                    >
                      <div className="img-box mb-4">
                        <Image
                          width={400}
                          height={350}
                          alt=""
                          src={`https://s3.us-east-1.amazonaws.com/tvishatest/${product.image[0].original}`}
                          className="rounded-lg object-cover w-full h-48"
                          loader={() =>
                            `https://s3.us-east-1.amazonaws.com/tvishatest/${product.image[0].original}`
                          }
                        />
                      </div>
                    </Link>
                    <div className="mb-4">
                      <Link href={`/products/${product.id}`}>
                        <h5 className="text-lg font-semibold text-gray-800 mb-2">
                          {product.brand_name}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          {product.product_name}
                        </p>
                      </Link>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md flex justify-between items-center transition-all duration-300"
                        id={`options-menu-${index}`}
                        aria-expanded={isOpenList[index]}
                        aria-haspopup="true"
                        onClick={() => toggleDropdown(index)}
                      >
                        <span>
                          {selectedVariant?.pack ?? product.variant[0].pack}
                        </span>
                        <RiArrowDropDownLine className="ml-2 w-6 h-6 text-gray-600" />
                      </button>
                      {isOpenList[index] && (
                        <div
                          className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg w-full bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-300"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`options-menu-${index}`}
                        >
                          <div className="py-1 border rounded-md border-gray-300">
                            {product.variant.map(
                              (item: Variant, itemIndex: number) => (
                                <div
                                  key={itemIndex}
                                  className="border-b last:border-0 border-gray-200 hover:bg-gray-100 transition-all duration-200 flex justify-between items-center px-4 py-1 cursor-pointer"
                                  onClick={() => selectVariant(item, index)}
                                >
                                  <div className="flex-grow">
                                    <span className="block text-gray-700">
                                      {item.pack}
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      &#8377;{item.price}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <div className="mt-4 text-left">
                        <span className="block font-bold text-gray-800">
                          &#8377;
                          {selectedVariant?.price ?? product.variant[0].price}
                        </span>
                      </div>
                    </Link>
                    <div className="flex mt-4">
                      <div className="flex w-full">
                        <div className="w-96 flex-1">
                          <button
                            type="button"
                            className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-1.5 px-20"
                            onClick={() =>
                              handleAddToCart(product.id, selectedVariant!)
                            }
                          >
                            Add
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => handleSaveForLater(index)}
                            className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-500 hover:bg-blue-50"
                          >
                            <FaBookmark />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Offer Section */}
            <div className="mt-10 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Special Offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Sample Offer Cards */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Discount on Fruits
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Up to 20% off on fresh fruits.
                  </p>
                  <button className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4">
                    Shop Now
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Buy 1 Get 1 Free
                  </h3>
                  <p className="text-gray-600 mb-4">
                    On selected dairy products.
                  </p>
                  <button className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4">
                    Shop Now
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Flat 30% Off
                  </h3>
                  <p className="text-gray-600 mb-4">On all bakery items.</p>
                  <button className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4">
                    Shop Now
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Special Discount
                  </h3>
                  <p className="text-gray-600 mb-4">
                    On groceries over &#8377;1000.
                  </p>
                  <button className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
            {/* End of Offer Section */}
          </div>
        ) : (
          <div className="w-full max-w-screen-xl mx-auto">
            <div className="flex justify-center items-center text-yellow-500 text-lg font-semibold">
              <p>No products to display</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
