import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
const API = import.meta.env.VITE_API_URL;


const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] =
  useState(() => {

    try {

      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );


      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch (error) {

      console.error(
        "Cart localStorage error:",
        error
      );

      return [];

    }

  });

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {

        console.log(
          "GUEST CART: Using localStorage"
        );
      
        return;
      
      }

      const response = await fetch(
        `${API}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success || !data.cart) return;
const formattedItems = data.cart.items
  .filter(item => item.product)
  .map(item => ({
    product: {
      ...item.product,
      image: item.product.images?.[0] || "/images/logo.png",
    },
    variant: {
      id: item.product._id.toString(),
      title: item.product.category,
      price_formatted: `₹${item.product.price}`,
      inventory_quantity: item.product.stock,
    },
    quantity: item.quantity,
  }));

      setCartItems(formattedItems);

    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  fetchCart();
}, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback(
    async (
      product,
      variant,
      quantity,
      availableQuantity
    ) => {
      const token =
        localStorage.getItem("token");
  
        const variantId = (variant.id || variant._id).toString();

        const existingItem = cartItems.find(
          item =>
            (item.variant.id || item.variant._id).toString() ===
            variantId.toString()
      );
  
      const currentCartQuantity =
        existingItem
          ? existingItem.quantity
          : 0;
  
      if (
        variant.manage_inventory &&
        currentCartQuantity + quantity >
          availableQuantity
      ) {
        throw new Error(
          `Not enough stock for ${product.title} (${variant.title}). Only ${availableQuantity} left.`
        );
      }
  
      // =========================
      // GUEST CART
      // =========================
  
      if (!token) {
        setCartItems(prevItems => {
          const variantId = (variant.id || variant._id).toString();

          const existingItem = prevItems.find(
            item =>
              (item.variant.id || item.variant._id).toString() ===
              variantId.toString()
          );
  
          if (existingItem) {
            return prevItems.map(item =>
              (item.variant.id || item.variant._id).toString() ===
(variant.id || variant._id).toString()
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity,
                  }
                : item
            );
          }
  
          return [
            ...prevItems,
            {
              product,
              variant,
              quantity,
            },
          ];
        });
  
        return;
      }
  
      // =========================
      // LOGGED-IN USER CART
      // =========================
  
      const response = await fetch(
        `${API}/cart/add`,
        {
          method: "POST",
  
          headers: {
            "Content-Type":
              "application/json",
  
            Authorization:
              `Bearer ${token}`,
          },
  
         body: JSON.stringify({
  productId: product._id,
  quantity,
}),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add product to cart"
        );
      }
  
      // Refresh local React cart
      // FIX: backend keys the cart ONLY by product._id (see Cart schema/controller),
      // so force the stored variant.id to match product._id — otherwise later
      // updateQuantity/removeFromCart calls send an id the backend can't find (404).
      setCartItems(prevItems => {
        const canonicalId = product._id.toString();

        const existingItem = prevItems.find(
          item =>
            (item.variant.id || item.variant._id).toString() ===
            canonicalId
        );
  
        if (existingItem) {
          return prevItems.map(item =>
            (item.variant.id || item.variant._id).toString() === canonicalId
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          );
        }
  
        return [
          ...prevItems,
          {
            product,
            variant: { ...variant, id: canonicalId },
            quantity,
          },
        ];
      });
    },
    [cartItems]
  );

  const removeFromCart = useCallback(
    async (variantId) => {
  
      try {
  
        const token =
          localStorage.getItem("token");
  
  
        // =========================
        // GUEST CART
        // =========================
  
        if (!token) {
  
          // FIX: removed the accidental nested `item => item =>` which made
          // the filter callback always return a function (always truthy),
          // so nothing was ever actually removed.
          setCartItems(prevItems =>
            prevItems.filter(
              item =>
              (item.variant.id || item.variant._id).toString() !==
              variantId.toString()
            )
          );
  
          return;
  
        }
  
  
        // =========================
        // LOGGED-IN USER CART
        // =========================
  
        const response = await fetch(
          `${API}/cart/remove/${variantId}`,
          {
            method: "DELETE",
  
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
  
  
        const data =
          await response.json();
  
  
        if (!response.ok) {
  
          throw new Error(
            data.message ||
            "Failed to remove item"
          );
  
        }
  
  
        setCartItems(prevItems =>
          prevItems.filter(
            item =>
              (item.variant.id || item.variant._id).toString() !==
              variantId.toString()
          )
        );
  
  
      } catch (error) {
  
        console.error(
          "Remove cart error:",
          error
        );
  
      }
  
    },
    []
  );

  const updateQuantity = useCallback(
    async (variantId, quantity) => {

     
      try {
  
        const token =
          localStorage.getItem("token");
  
  
        // =========================
        // GUEST CART
        // =========================
  
        if (!token) {
  
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.variant.id.toString() === variantId.toString()
                ? {
                    ...item,
                    quantity,
                  }
                : item
            )
          );
  
          return;
  
        }
  
  
        // =========================
        // LOGGED-IN USER CART
        // =========================
  
        const response = await fetch(
          `${API}/cart/update`,
          {
            method: "PUT",
  
            headers: {
              "Content-Type":
                "application/json",
  
              Authorization:
                `Bearer ${token}`,
            },
  
            body: JSON.stringify({
              productId: variantId.toString(),
              quantity,
            }),
          }
        );
  
  
        const data =
          await response.json();
  
  
        if (!response.ok) {
  
          throw new Error(
            data.message ||
            "Failed to update cart"
          );
  
        }
  
  
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.variant.id.toString() === variantId.toString()
              ? {
                  ...item,
                  quantity,
                }
              : item
          )
        );
  
  
      } catch (error) {
  
        console.error(
          "Update cart error:",
          error
        );
  
      }
  
    },
    []
  );

  const clearCart = useCallback(() => {
  setCartItems([]);

  localStorage.removeItem(
    CART_STORAGE_KEY
  );
}, []);

  const getCartTotal = useCallback(() => {
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product.price * item.quantity,
    0
  );

  return `₹${total}`;
}, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};