import React, { Suspense } from "react";

import ProductList from "./component/ListProducts";
import { CartProvider } from "../context/CartContext";
import Header from "@/app/components/Header";

const Page: React.FC = () => {
  return (
    <>
      <CartProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductList />
        </Suspense>
      </CartProvider>
    </>
  );
};

export default Page;
