"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the types for CartItem and Variant
interface Variant {
  pack: string;
  price: number;
}

interface CartItem {
  id: number; // Unique ID for the cart item in the database
  productId: number;
  variant: Variant;
  quantity: number;
}

// Define the state and actions for the cart
interface CartState {
  cartItems: CartItem[];
}

interface CartAction {
  type: string;
  payload: any;
}

// Create the initial state and reducer function for the cart
const initialState: CartState = {
  cartItems: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case "UPDATE_CART":
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
}

// Create the CartContext and provide methods to manipulate the cart
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
