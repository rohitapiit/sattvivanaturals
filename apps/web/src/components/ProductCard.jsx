import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants?.[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant.sale_price_formatted : (displayVariant?.price_formatted || `₹${product.price}`), [displayVariant, hasSale, product.price]);
  
  // Mock rating if not provided by API
  // const rating = product.rating || (4.5 + Math.random() * 0.5).toFixed(1);
  // const reviews = product.reviews || Math.floor(Math.random() * 200) + 50;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants?.length > 1) {
      navigate(`/product/${product.id}`);
      return;
    }

    const defaultVariant = product.variants?.[0] || { id: `var-${product.id}`, title: 'Default', inventory_quantity: 100 };

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity);
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col relative">
          
         

          {/* Image Container */}
          <div className="relative aspect-square bg-white overflow-hidden rounded-t-2xl flex items-center justify-center">

  <img
    src={product.images?.[0] || "/images/logo.png"}
    alt={product.title}
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

  {product.ribbon_text && (
    <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
      {product.ribbon_text}
    </div>
  )}

</div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            {/* <div className="flex items-center gap-1.5 mb-2">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-xs font-semibold text-foreground">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div> */}

            <h3 className="heading-font text-lg font-bold text-primary mb-1.5 line-clamp-2 leading-tight">
              {product.title}
            </h3>
            
            <p className="body-font text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {product.subtitle || product.description || 'Discover the pure, natural goodness of our traditional selections.'}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <div className="text-xl font-bold text-secondary">
                {displayPrice}
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                size="sm"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-4 gold-glow transition-all"
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" /> 
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;