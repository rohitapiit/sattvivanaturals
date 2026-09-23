import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ==========================================
  // PRODUCT ID
  // Supports both MongoDB _id and id
  // ==========================================

  const productId = product?._id || product?.id;

  // ==========================================
  // DISPLAY VARIANT
  // ==========================================

  const displayVariant = useMemo(() => {
    return product?.variants?.[0] || null;
  }, [product]);

  // ==========================================
  // SALE CHECK
  // ==========================================

  const hasSale = useMemo(() => {
    return Boolean(
      displayVariant?.sale_price_in_cents !== null &&
        displayVariant?.sale_price_in_cents !== undefined
    );
  }, [displayVariant]);

  // ==========================================
  // DISPLAY PRICE
  // ==========================================

  const displayPrice = useMemo(() => {
    if (hasSale) {
      return (
        displayVariant?.sale_price_formatted ||
        `₹${displayVariant?.price || product?.price || 0}`
      );
    }

    return (
      displayVariant?.price_formatted ||
      `₹${displayVariant?.price || product?.price || 0}`
    );
  }, [displayVariant, hasSale, product]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // ==========================================
    // MULTIPLE VARIANTS
    // ==========================================

    if (product?.variants?.length > 1) {
      navigate(`/product/${productId}`);
      return;
    }

    // ==========================================
    // DEFAULT VARIANT
    // ==========================================

    const defaultVariant = displayVariant || {
      id: productId,
      _id: productId,
      title: product?.category || "Default",
      price: product?.price || 0,
      price_formatted: `₹${product?.price || 0}`,
      sale_price_formatted: `₹${product?.price || 0}`,
      stock: product?.stock ?? 100,
      inventory_quantity: product?.stock ?? 100,
      manage_inventory: false,
    };

    // ==========================================
    // NORMALIZED PRODUCT
    // ==========================================

    const formattedProduct = {
      ...product,
      _id: productId,
      id: productId,
      image:
        product?.image ||
        product?.images?.[0] ||
        "/images/logo.png",
      price:
        defaultVariant?.price ??
        product?.price ??
        0,
    };

    // ==========================================
    // AVAILABLE STOCK
    // ==========================================

    const availableQuantity =
      defaultVariant?.stock ??
      defaultVariant?.inventory_quantity ??
      product?.stock ??
      100;

    // ==========================================
    // ADD TO CART
    // ==========================================

    try {
      await addToCart(
        formattedProduct,
        defaultVariant,
        1,
        availableQuantity
      );

      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding to cart",
        description:
          error?.message ||
          "Unable to add this product to the cart.",
      });
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="h-full"
    >
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col relative">
        {/* ==========================================
            PRODUCT CONTENT
        ========================================== */}

        <Link
          to={`/product/${productId}`}
          className="block flex flex-col h-full"
        >
          {/* IMAGE */}

          <div className="relative aspect-square bg-white overflow-hidden rounded-t-2xl flex items-center justify-center">
            <img
              src={
                product?.images?.[0] ||
                product?.image ||
                "/images/logo.png"
              }
              alt={product?.title || "Product"}
              className="
                max-w-full
                max-h-full
                object-contain
                p-2
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />

            {product?.ribbon_text && (
              <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                {product.ribbon_text}
              </div>
            )}
          </div>

          {/* CONTENT */}

          <div className="p-5 flex flex-col flex-grow">
            <h3 className="heading-font text-lg font-bold text-primary mb-1.5 line-clamp-2 leading-tight">
              {product?.title}
            </h3>

            <p className="body-font text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {product?.subtitle ||
                product?.description ||
                "Discover the pure, natural goodness of our traditional selections."}
            </p>
          </div>
        </Link>

        {/* ==========================================
            PRICE + ADD BUTTON

            IMPORTANT:
            THIS IS OUTSIDE THE LINK
            SO MOBILE CLICK DOES NOT TRIGGER
            PRODUCT PAGE NAVIGATION
        ========================================== */}

        <div className="p-5 pt-0 flex items-center justify-between mt-auto">
          <div className="text-xl font-bold text-secondary">
            {displayPrice}
          </div>

          <Button
            type="button"
            onClick={handleAddToCart}
            size="sm"
            className="
              bg-secondary
              hover:bg-secondary/90
              text-secondary-foreground
              font-semibold
              rounded-full
              px-4
              gold-glow
              transition-all
              touch-manipulation
            "
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;