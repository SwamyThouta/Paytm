import { subcategory, Product } from "../../types";
const sublist = async (): Promise<subcategory[]> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub-category/all-list`,
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

const getsubCategoriesList = async (id: number): Promise<Product[]> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sub-category/subcategoryproduct/${id}`,
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
export { sublist, getsubCategoriesList };
