"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Button from "@/app/components/form/Button";
// import { list as productList } from "../service/products";
import { FaRegBookmark, FaHome } from "react-icons/fa";
import { getCategoriesList } from "@/service/category";
import { Product } from "../../../../types";
import { addtoCart } from "../../../service/products";
import { CgProductHunt } from "react-icons/cg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getsubCategoriesList } from "@/service/subcategory";

interface CartItem {
  productId: number;
  variantPack: string;
}
interface Props {
  params: {
    id: string;
  };
}
interface Variant {
  pack: string;
  price: number;
}
export default function Home({ params: { id } }: Props) {
  const [isOpenList, setIsOpenList] = useState<boolean[]>([]);
  const [selectedVariantList, setSelectedVariantList] = useState<
    (Variant | null)[]
  >([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  // const [cartItems, setCartItems] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       const products = await productList();
  //       if (products.length === 0) {
  //         setError("Unable to Fetch");
  //       } else {
  //         setProductsList(products);
  //         setIsOpenList(Array(products.length).fill(false));
  //         setSelectedVariantList(Array(products.length).fill(null));
  //       }
  //     } catch (error) {
  //       let msg = (error as Error).message;
  //       setError(msg);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getsubCategoriesList(parseInt(id));
        console.log("subcategoryproductData:", productData);
        setProductsList(productData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching product data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  console.log("productsList:", productsList);
  const renderBreadcrumbs = () => {
    if (productsList.length === 0) return null;

    const firstProduct = productsList[0];
    const { category_name, sub_category_name, category_id } = firstProduct;

    const breadcrumbs = [
      <Link key="home" href="/">
        <p className="text-yellow-500 hover:text-yellow-700 flex items-center">
          <FaHome className="inline mr-2" />
          Home
        </p>
      </Link>,
    ];

    if (category_name) {
      breadcrumbs.push(
        <span key="sep1" className="mx-2 text-gray-500">
          /
        </span>,
        <Link key="category" href={`/categories/${category_id}`}>
          <p className="text-yellow-500 hover:text-yellow-700">
            {category_name}
          </p>
        </Link>
      );

      if (sub_category_name) {
        breadcrumbs.push(
          <span key="sep2" className="mx-2 text-gray-500">
            /
          </span>,
          <Link key="subcategory" href={`/subcategory/${category_id}`}>
            <p className="text-yellow-500 hover:text-yellow-700 font-bold underline">
              {sub_category_name}
            </p>
          </Link>
        );
      }
    }

    return (
      <div className="flex items-center space-x-2 mb-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>{crumb}</React.Fragment>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          setIsOpenList((prev) => {
            const newIsOpenList = [...prev];
            newIsOpenList[index] = false;
            return newIsOpenList;
          });
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleAddToCart = async (
    productId: number,
    productVariants: Variant[],
    selectedVariant: Variant | null
  ) => {
    const variantToAdd = selectedVariant || productVariants[0];

    try {
      const response = await addtoCart({
        guest_id: 1,
        user_id: 3,
        product_id: productId,
        quantity: 1,
        variant: [variantToAdd],
      });

      console.log("response", response);
      if (response.status === 200) {
        toast("Product added to cart", {
          type: "success",
          theme: "colored",
          position: "top-right",
        });
        setCartItems((prevCartItems) => [...prevCartItems, response.data.id]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <Header />
      <div className="flex justify-center items-center mt-5 px-6 mb-10">
        {loading ? (
          <div className="text-yellow-500 font-semibold text-lg">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-lg">{error}</div>
        ) : productsList && productsList.length > 0 ? (
          <div className="w-full max-w-screen-xl mx-auto">
            {renderBreadcrumbs()}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsList.map((product, index) => (
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
                    <Link
                      href={`/products/${product.id}`}
                      onClick={(e) => isOpenList[index] && e.preventDefault()}
                    >
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
                      className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 rounded-md flex justify-between items-center"
                      id={`options-menu-${index}`}
                      aria-expanded={isOpenList[index]}
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(index)}
                    >
                      {selectedVariantList[index]?.pack ??
                        product.variant[0].pack}
                      <RiArrowDropDownLine className="ml-2 w-8 h-10" />
                    </button>
                    {isOpenList[index] && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg w-full bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby={`options-menu-${index}`}
                      >
                        <div className="py-1 border rounded-md border-gray-400">
                          {product.variant.map((item: any, itemIndex: any) => (
                            <div
                              key={itemIndex}
                              className="border border-gray-200 hover:bg-gray-100 group flex justify-between items-center px-2 py-2"
                              onClick={() => selectVariant(item, index)}
                            >
                              <div className="flex-grow">
                                <span className="block">{item.pack}</span>
                                <span className="font-bold block">
                                  &#8377;{item.price}
                                </span>
                              </div>
                              <button
                                type="button"
                                className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-1 px-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={() => selectVariant(item, index)}
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <div className="mt-4 text-left">
                      <span className="block font-bold text-gray-800">
                        &#8377;
                        {selectedVariantList[index]?.price ??
                          product.variant[0].price}
                      </span>
                    </div>
                  </Link>
                  <div className="flex mt-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md py-2 px-4 mr-2"
                      onClick={() => {}}
                    >
                      <FaRegBookmark />
                    </button>
                    <button
                      type="button"
                      className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4 flex-1"
                      onClick={() =>
                        handleAddToCart(
                          product.id,
                          product.variant,
                          selectedVariantList[index]
                        )
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Offer Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Special Offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Sample Offer Cards */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
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
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
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
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Flat 30% Off
                  </h3>
                  <p className="text-gray-600 mb-4">On all bakery items.</p>
                  <button className="bg-yellow-500 text-white hover:bg-yellow-400 rounded-md py-2 px-4">
                    Shop Now
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
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
