"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/form/Button";
import { useEffect, useState } from "react";
import { get as getProduct } from "@/service/products";
import { FaRegBookmark, FaHome } from "react-icons/fa";
import { Product } from "../../../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { addtoCart, cartDelete } from "../../../service/products";

interface Variant {
  pack: string;
  price: number;
  in_cart: boolean;
  cart_id: number;
}
interface Props {
  params: {
    id: string;
  };
}

export default function Home({ params: { id } }: Props) {
  const [isOpenList, setIsOpenList] = useState<boolean[]>([]);
  const [selectedVariantList, setSelectedVariantList] = useState<
    (Variant | null)[]
  >([]);
  const [productsList, setProductsList] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0); // State to track selected variant index
  const [cartItem, setCartItem] = useState<boolean>(false);
  const [cartItemId, setCartItemId] = useState<number>(0);
  const [cartItems, setCartItems] = useState<number[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProduct(parseInt(id));
        console.log("productData:", productData);
        setProductsList(productData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching product data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (productsList) {
      setSelectedVariantList([productsList.variant[selectedVariantIndex]]);
      if (productsList.variant[selectedVariantIndex].in_cart) {
        setCartItem(true);
        setCartItemId(productsList.variant[selectedVariantIndex].cart_id);
      }
    }
  }, [productsList]);

  const handleAddToCart = async () => {
    // Add logic to update quantity and button text based on selected variant
    if (!selectedVariantList) {
      toast.error("Please Select a Pack.");
      return;
    }
    if (!cartItem) {
      setCartItem(true);
    }

    setProductsList((prev) => {
      if (prev && selectedVariantList) {
        prev.variant = prev.variant.map((_d) => {
          if (selectedVariantList[0]?.pack == _d.pack) {
            _d.in_cart = true;
          }
          return _d;
        });
      }
      return prev;
    });

    const response = await addtoCart({
      guest_id: 1,
      user_id: 3,
      product_id: productsList?.id,
      quantity: 1,
      variant: selectedVariantList.map((_d) => ({
        pack: _d?.pack,
        price: _d?.price,
      })),
    });
    console.log("responce", response);
    if (response.status == 200) {
      toast("Item added to cart", {
        type: "success",
        theme: "colored",
        position: "top-right",
      });
      setCartItems(response.data.id);
    } else {
      toast.error(response.data.message);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  const toggleCartItem = async () => {
    if (cartItem) {
      const categoryDelete = await cartDelete(cartItemId);
      if (!!categoryDelete) {
        setProductsList((prevProductsList) => {
          if (!prevProductsList) return null;
          const updatedProductsList = { ...prevProductsList };
          updatedProductsList.variant[selectedVariantIndex].in_cart = false;
          return updatedProductsList;
        });
      } else {
        toast.error("Something went wrong");
      }
    }
    setCartItem(!cartItem);
  };

  function toggleDropdown(index: number) {
    setIsOpenList((prevIsOpenList) => {
      const updatedIsOpenList = [...prevIsOpenList];
      updatedIsOpenList[index] = !updatedIsOpenList[index];
      return updatedIsOpenList;
    });
  }
  function selectVariant(variant: Variant, variantIndex: number) {
    console.log("Selected variant:", variant, variantIndex);
    setCartItem(variant.in_cart);
    setSelectedVariantList((prevSelectedVariantList) => [variant]);
    setCartItemId(variant.cart_id);
    console.log("selectedVariantList", selectedVariantList);

    setProductsList((prevProductsList) => {
      if (!prevProductsList) return null;
      const updatedProductsList = { ...prevProductsList };
      updatedProductsList.variant[variantIndex] = variant;
      return updatedProductsList;
    });
    toggleDropdown(variantIndex);
    setSelectedVariantIndex(variantIndex);
  }

  const renderBreadcrumbs = () => {
    if (!productsList) return null;

    const {
      category_name,
      subcategory_name,
      subsubcategory_name,
      category_id,
      subsubcategory_id,
      subcategory_id,
    } = productsList;

    const breadcrumbs = [
      <Link key="home" href="/">
        <p className="text-yellow-500 hover:text-yellow-700">
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

      if (subcategory_name) {
        breadcrumbs.push(
          <span key="sep2" className="mx-2 text-gray-500">
            /
          </span>,
          <Link key="subcategory" href={`/subcategory/${subcategory_id}`}>
            <p className="text-yellow-500 hover:text-yellow-700">
              {subcategory_name}
            </p>
          </Link>
        );

        if (subsubcategory_name) {
          breadcrumbs.push(
            <span key="sep3" className="mx-2 text-gray-500">
              /
            </span>,
            <Link
              key="subsubcategory"
              href={`/subsubcategory/${subsubcategory_id}`}
            >
              <p className="text-yellow-500 hover:text-yellow-700">
                {subsubcategory_name}
              </p>
            </Link>
          );
        }
      }
    }
    return breadcrumbs;
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      <Header />
      <div className="flex justify-start px-1 py-1 ms-20 mt-2">
        {renderBreadcrumbs()}
      </div>
      <div className="flex flex-grow flex-wrap justify-center p-4">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-5 md:space-y-0 md:space-x-8 w-full max-w-6xl">
          <div className="w-full md:w-[12%]">
            {productsList?.image && (
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 mt-5 overflow-x-auto md:overflow-x-hidden">
                {productsList.image.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`cursor-pointer border-2 border-transparent ${
                      selectedImageIndex === index ? "border-yellow-500" : ""
                    }`}
                  >
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={`https://s3.us-east-1.amazonaws.com/tvishatest/${image.original}`}
                      className="transition duration-300 ease-in-out object-cover border border-gray-300 rounded-lg w-24 h-24 md:w-full md:h-24"
                      loader={() =>
                        `https://s3.us-east-1.amazonaws.com/tvishatest/${image.original}`
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-2/5">
            {productsList?.image[selectedImageIndex] && (
              <Image
                width={550}
                height={500}
                alt=""
                src={`https://s3.us-east-1.amazonaws.com/tvishatest/${productsList.image[selectedImageIndex].original}`}
                className="group-hover:scale-110 transition duration-300 ease-in-out object-cover border border-gray-300 rounded-lg w-full"
                loader={() =>
                  `https://s3.us-east-1.amazonaws.com/tvishatest/${productsList.image[selectedImageIndex].original}`
                }
              />
            )}
          </div>
          <div className="w-full md:w-2/5 mt-3 md:mt-0">
            {productsList && (
              <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
                <div className="text-lg font-normal text-gray-700">
                  <span className="border-b-2 border-yellow-300">
                    {productsList.brand_name}
                  </span>
                </div>

                <div className="font-bold mt-2 text-xl text-gray-800">
                  <span>{productsList.brand_name}</span>
                  <span>{` ${productsList.product_name}`}</span>
                  <span>, </span>
                  <span>{productsList.variant[selectedVariantIndex].pack}</span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      Price: &#8377;
                      {productsList.variant[selectedVariantIndex].price}
                    </p>
                  </div>
                </div>

                <div className="flex mt-4 space-x-4">
                  {cartItem ? (
                    <Button
                      id=""
                      type="button"
                      onClick={toggleCartItem}
                      className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-bold"
                      title="Remove"
                    />
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full font-bold"
                    >
                      Add to Cart
                    </button>
                  )}

                  <button className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center w-full">
                    <FaRegBookmark className="mr-2" />
                    Save for Later
                  </button>
                </div>
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {productsList.variant.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      type="button"
                      className={`block px-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left border-gray-500 ${
                        selectedVariantIndex === itemIndex
                          ? "border-green-500"
                          : ""
                      }`}
                      role="menuitem"
                      onClick={() => selectVariant(item, itemIndex)}
                    >
                      <div
                        className={`border text-gray-500 border-gray-400 p-2 ${
                          selectedVariantIndex === itemIndex
                            ? "border-green-500"
                            : ""
                        }`}
                      >
                        <span className="block font-bold text-black">
                          {item.pack}
                        </span>
                        <span className="block font-bold text-black mt-2">
                          &#8377;{item.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {productsList && (
        <div className="flex justify-center">
          <div className="font-bold mt-2 text-lg md:w-4/6 text-gray-800">
            <span>{productsList.brand_name}</span>
            <span>{` ${productsList.product_name}`}</span>
          </div>
        </div>
      )}
      {productsList && (
        <div className="flex justify-center mb-8">
          <div className="md:w-4/6 px-6 border border-gray-600 rounded-md mb-4">
            <h4 className="text-gray-700 text-lg font-bold">
              About the Product
            </h4>
            <div className="font-normal mt-2 text-sm text-gray-600">
              <p className="mb-2">{productsList.description}</p>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-center text-gray-700">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      <Footer />
    </div>
  );
}
