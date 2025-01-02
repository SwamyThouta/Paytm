export type Product = {
  id: number;
  variant: {
    pack: string;
    price: number;
    in_cart: boolean;
    cart_id: number;
  }[];
  productId: number;
  id: number;
  product_name: string;
  description: string;
  category_name: string;
  subcategory_name: string;
  subsubcategory_name: string;
  category_id: number;
  subcategory_id: number;
  subsubcategory_id: number;
  sub_sub_category_name: string;
  sub_category_id: number;

  image: {
    large: string;
    small: string;
    medium: string;
    original: string;
  }[];

  variant: {
    pack: string;
    price: number;
    in_cart: boolean;
    cart_id: number;
  }[];
  id: number;
  brand_name: string;
  sub_category_name: string;
  category_name: string;
  category_id: string;
  quantity: number;
  brand_name: string;
};

type Login = {
  email: string;
  password: string;
};
type category = {
  id: number;
  name: string;
};
type subcategory = {
  id: number;
  category_id: number;
  name: string;
  category_name: string;
};
type subsubcategory = {
  id: number;
  sub_category_id;
  name: string;
  sub_category_name: string;
  category_name: string;
};
