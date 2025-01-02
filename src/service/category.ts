import { category, Product } from "../../types";
const list = async (): Promise<category[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/list`, {
    method: "GET",
  })
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return null;
      }
    })
    .catch((e) => []);
};

const getCategoriesList = async (id: number): Promise<Product[]> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/categoryproduct/${id}`,
    {
      method: "GET",
      next: { revalidate: 3600, tags: ["post"] },
    }
  )
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return {};
      }
    })
    .catch((e) => {});
};

export { list, getCategoriesList };
