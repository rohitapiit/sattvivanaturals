import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart as ShoppingCartIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const ShoppingCart = ({
  isCartOpen,
  setIsCartOpen,
}) => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            top-[118px]
            bottom-[72px]
            left-0
            right-0

            md:inset-0

            bg-foreground/60
            z-[60]
          "
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="
              absolute
              right-0
              top-0

              h-full
              w-full
              max-w-md

              bg-card
              text-card-foreground

              shadow-2xl

              flex
              flex-col

              md:rounded-l-lg
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-card-foreground">
                Shopping Cart
              </h2>

              <Button
                onClick={() =>
                  setIsCartOpen(false)
                }
                variant="ghost"
                size="icon"
                className="text-card-foreground hover:bg-muted"
              >
                <X />
              </Button>
            </div>

            {/* CART ITEMS */}
            <div className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <ShoppingCartIcon
                    size={60}
                    className="mb-4 text-gray-400"
                  />

                  <h3 className="text-xl font-semibold text-card-foreground">
                    Your Cart is Empty
                  </h3>

                  <p className="text-muted-foreground mt-2 mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>

                  <Button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/products");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.variant.id}
                    className="
                      flex
                      items-center
                      gap-3

                      bg-card
                      border
                      border-border

                      p-3
                      rounded-lg
                    "
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="
                        w-16
                        h-16

                        md:w-20
                        md:h-20

                        object-cover
                        rounded-md
                        shrink-0
                      "
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground line-clamp-2">
                        {item.product.title}
                      </h3>

                      <p className="text-sm text-muted-foreground truncate">
                        {item.variant.title}
                      </p>

                      <p className="text-sm text-primary font-bold mt-1">
                        {item.variant.sale_price_formatted}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          onClick={() => {
                            if (
                              item.quantity === 1
                            ) {
                              removeFromCart(
                                item.variant.id
                              );
                            } else {
                              updateQuantity(
                                item.variant.id,
                                item.quantity - 1
                              );
                            }
                          }}
                          size="sm"
                          variant="ghost"
                          className="px-2 text-card-foreground hover:bg-muted"
                        >
                          -
                        </Button>

                        <span className="px-2 text-card-foreground">
                          {item.quantity}
                        </span>

                        <Button
                          onClick={() =>
                            updateQuantity(
                              item.variant.id,
                              item.quantity + 1
                            )
                          }
                          size="sm"
                          variant="ghost"
                          className="px-2 text-card-foreground hover:bg-muted"
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        onClick={() =>
                          removeFromCart(
                            item.variant.id
                          )
                        }
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/90 text-xs h-auto p-0"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CART TOTAL */}
            {cartItems.length > 0 && (
              <div className="p-4 md:p-6 border-t border-border shrink-0 bg-card">
                <div className="flex justify-between items-center mb-4 text-card-foreground">
                  <span className="text-lg font-medium">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    {getCartTotal()}
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;