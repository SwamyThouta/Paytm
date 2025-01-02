import { error } from "console";
import { Product } from "../../types";

const url = process.env.NEXT_PUBLIC_API_URL;

const list = async (): Promise<Product[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all-list`, {
    method: "GET",
    next: { revalidate: 3600, tags: ["Product"] },
  })
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return [];
      }
    })
    .catch((e) => []);
};

const get = async (id: number): Promise<Product> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${id}`, {
    method: "GET",
    next: { revalidate: 3600, tags: ["post"] },
  })
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return {};
      }
    })
    .catch((e) => {});
};
const getCartList = async (id: number): Promise<Product> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/list/${id}`, {
    method: "GET",
    next: { revalidate: 3600, tags: ["post"] },
  })
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return {};
      }
    })
    .catch((e) => {});
};
const addtoCart = async (data: {}): Promise<any> => {
  console.log("data", data);
  const options = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    method: "POST",
    next: { revalidate: 1, tags: ["post"] },
    body: JSON.stringify(data),
  };
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add`, options)
    .then(async (res) => {
      let data: any = await res.json();
      return { status: res.status, data };
    })
    .then(async (res) => {
      return res;
    })
    .catch((e) => {});
};

const cartDelete = async (
  id: number
): Promise<{ status: number; data: any } | undefined> => {
  console.log("cart", id);
  const options = {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    method: "DELETE",
  };
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${id}`, options)
    .then(async (res) => {
      let data: any = await res.json();
      return { status: res.status, data };
    })
    .catch((e) => undefined);
};

const updateQuantity = async (data: number, id: number): Promise<{}> => {
  console.log("updateQuantity", data, id);
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json", // Corrected Content-Type header
    },
    method: "PUT",
    body: JSON.stringify({ quantity: data }), // Converted data to JSON string
  };
  console.log(options.body);
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${id}`, options)
    .then(async (res) => {
      if (res.status === 400) {
        const errorJson = await res.json();
        return { error: errorJson };
      } else {
        return res.json();
      }
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};

export { list, get, addtoCart, getCartList, cartDelete, updateQuantity };
