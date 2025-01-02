import { subsubcategory, Product } from "../../types";

const subsublist = async (): Promise<subsubcategory[]> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub-sub-category/all-list`,
    {
      method: "GET",
    }
  )
    .then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        return null;
      }
    })
    .catch((e) => []);
};

const getsubsubCategoriesList = async (id: number): Promise<Product[]> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub-sub-category/subsubcategoryproduct/${id}`,
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

export { subsublist, getsubsubCategoriesList };
