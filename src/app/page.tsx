import React, { Suspense } from "react";
import ProductList from "./products/component/ListProducts";

import Header from "@/app/components/Header";

export default function Page() {
  return (
    <>
      {/* <Header title={''} type={''} /> */}

      <Suspense>
        <ProductList />
      </Suspense>
    </>
  );
}
