import React, {useState, useMemo, useEffect} from "react";

import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useParams } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';




// 33 Hardcoded Products matching the requested catalog
const allProducts = [
  // OILS
  { id: 'o1', title: 'Wood Pressed Mustard Oil', price: 450, rating: 4.8, reviews: 142, category: 'Oils', size: '500ml', image: 'images/logo81.png', description: 'Traditional cold-pressed mustard oil.' },
  { id: 'o2', title: 'Wood Pressed Mustard Oil', price: 799, rating: 4.8, reviews: 142, category: 'Oils', size: '1L', image: 'images/logo81.png', description: 'Traditional cold-pressed mustard oil.' },
  { id: 'o3', title: 'Wood Pressed Groundnut Oil', price: 520, rating: 4.7, reviews: 89, category: 'Oils', size: '500ml', image: 'images/logo12.png', description: 'Pure, unrefined groundnut oil.' },
  { id: 'o4', title: 'Wood Pressed Groundnut Oil', price: 899, rating: 4.7, reviews: 89, category: 'Oils', size: '1L', image: 'images/logo12.png', description: 'Pure, unrefined groundnut oil.' },
  { id: 'o5', title: 'Wood Pressed Coconut Oil', price: 680, rating: 4.9, reviews: 210, category: 'Oils', size: '500ml', image: 'images/logo9.png', description: 'Edible grade pure coconut oil.' },
  { id: 'o6', title: 'Wood Pressed Coconut Oil', price: 1199, rating: 4.9, reviews: 210, category: 'Oils', size: '1L', image: 'images/logo8.png', description: 'Edible grade pure coconut oil.' },
  { id: 'o7', title: 'Cold Pressed Mustard Oil', price: 520, rating: 4.6, reviews: 65, category: 'Oils', size: '500ml', image: 'images/logo91.png', description: 'Premium grade cold pressed oil.' },
  { id: 'o8', title: 'Cold Pressed Groundnut Oil', price: 580, rating: 4.6, reviews: 78, category: 'Oils', size: '500ml', image: 'images/logo13.png', description: 'Healthy everyday cooking oil.' },
  
  
  // DRY FRUITS
  { id: 'd1', title: ' Goan Cashew', price: 599, rating: 4.7, reviews: 112, category: 'Dry Fruits', size: '250g', image: 'images/logo14.png', description: 'Premium large cashews from Goa.' },
  { id: 'd3', title: 'Konkan Cashew', price: 549, rating: 4.6, reviews: 88, category: 'Dry Fruits', size: '250g', image: 'images/logo141.png', description: 'Sweet and crunchy Konkan cashews.' },
  { id: 'd4', title: 'Mamra Badam', price: 449, rating: 4.8, reviews: 145, category: 'Dry Fruits', size: '250g', image: 'images/logo18.png', description: 'Nutrient-rich Mamra almonds.' },
  { id: 'd5', title: 'Kashmiri Badam', price: 499, rating: 4.8, reviews: 120, category: 'Dry Fruits', size: '250g', image: 'images/logo18.png', description: 'Authentic sweet Kashmiri almonds.' },
  { id: 'd6', title: 'Kashmiri Walnuts', price: 399, rating: 4.7, reviews: 95, category: 'Dry Fruits', size: '250g', image: 'images/logo17.png', description: 'Brain-boosting fresh walnuts.' },
  { id: 'd7', title: 'Iranian Pista', price: 699, rating: 4.9, reviews: 210, category: 'Dry Fruits', size: '200g', image: 'images/logo16.png', description: 'Premium roasted Iranian pistachios.' },
  { id: 'd8', title: 'Afghani Black Kishmish', price: 349, rating: 4.6, reviews: 82, category: 'Dry Fruits', size: '250g', image: 'images/logo15.png', description: 'Sweet, natural black raisins.' },
  { id: 'd9', title: 'Nut Bar', price: 299, rating: 4.5, reviews: 60, category: 'Dry Fruits', size: '250g', image: 'images/logo19.png', description: 'Traditional large raisins with seeds.' },
  { id: 'd10', title: 'Nut Ladoo', price: 899, rating: 4.8, reviews: 310, category: 'Dry Fruits', size: '500g', image: 'images/logo20.png', description: 'Perfect blend of premium nuts and dried fruits.' },
  
  // SPICES
  { id: 's1', title: 'Lakhdong Haldi', price: 199, rating: 4.7, reviews: 115, category: 'Spices', size: '100g', image: 'images/logo06.png', description: 'High-curcumin turmeric powder.' },
  { id: 's2', title: 'Byadgi Karnataka Lal Mirch', price: 249, rating: 4.8, reviews: 140, category: 'Spices', size: '100g', image: 'images/logo1.png', description: 'Deep red color, mild spice chili.' },
  { id: 's3', title: 'Guntur Andhra Lal Mirch', price: 229, rating: 4.7, reviews: 98, category: 'Spices', size: '100g', image: 'images/logo0.png', description: 'Authentic spicy red chili powder.' },
  { id: 's4', title: 'Kashmiri Lal Mirch', price: 279, rating: 4.9, reviews: 260, category: 'Spices', size: '100g', image: 'images/logo90.png', description: 'Rich color, low heat classic chili.' },
  { id: 's5', title: 'Rajasthan Dhaniya', price: 149, rating: 4.6, reviews: 75, category: 'Spices', size: '100g', image: 'images/logo3.png', description: 'Fresh, aromatic coriander powder.' },
  { id: 's6', title: 'Gujarati Unjha Jeera', price: 179, rating: 4.7, reviews: 110, category: 'Spices', size: '100g', image: 'images/logo5.png', description: 'Premium grade cumin seeds.' },
  { id: 's7', title: 'Saunf', price: 129, rating: 4.5, reviews: 50, category: 'Spices', size: '100g', image: 'images/logo7.png', description: 'Sweet and aromatic fennel seeds.' },
  { id: 's8', title: 'SattViva Special Chaat Masala', price: 189, rating: 4.8, reviews: 130, category: 'Spices', size: '100g', image: 'images/logo2.png', description: 'Tangy, spicy homemade blend.' },
  { id: 's9', title: 'SattViva Special Garam Masala', price: 219, rating: 4.9, reviews: 185, category: 'Spices', size: '100g', image: 'images/logo4.png', description: 'Authentic robust flavor enhancer.' },

  
  // HEALTH PUNCH
  
  { id: 'h2', title: 'Peanut Butter', price: 299, rating: 4.7, reviews: 105, category: 'Health Punch', size: '250g', image: 'images/logo21.png', description: 'Creamy, 100% roasted peanuts.' },
  
];

const categories = ['All', 'Oils', 'Dry Fruits', 'Spices', 'Health Punch'];



const ProductCatalog = () => {
  const navigate = useNavigate();
const handleCategoryClick = (cat) => {
  setActiveCategory(cat);

  switch (cat) {
    case "All":
      navigate("/products");
      break;

    case "Oils":
      navigate("/products/oils");
      break;

    case "Dry Fruits":
      navigate("/products/dry-fruits");
      break;

    case "Spices":
      navigate("/products/spices");
      break;

    case "Health Punch":
      navigate("/products/health-punch");
      break;

    default:
      navigate("/products");
  }
};
  const { category, subCategory } = useParams();
  
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [addedProductId, setAddedProductId] = useState(null);
const [showOilDropdown, setShowOilDropdown] = useState(false);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API}/products`,
      );

      const data = await response.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  useEffect(() => {

  if (!category) {
    setActiveCategory("All");
    return;
  }

  if (category === "oils") {
    setActiveCategory("Oils");
  }

  else if (category === "dry-fruits") {
    setActiveCategory("Dry Fruits");
  }

  else if (category === "spices") {
    setActiveCategory("Spices");
  }

  else if (category === "health-punch") {
    setActiveCategory("Health Punch");
  }

  else if (category === "oils") {
  setActiveCategory("Oils");
}

}, [category]);
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedProducts = useMemo(() => {

    const normalize = (str = "") =>
  str.toLowerCase().replace(/\s+/g, "-");

    console.log(products);
    let filtered = [...products];

    // Filter using URL if available
    if (category) {
      filtered = filtered.filter(
        product =>
          normalize(product.category) === normalize(category)
      );
    }
    // Otherwise use the selected button
    else if (activeCategory !== "All") {
      filtered = filtered.filter(
        product =>
          product.category?.toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }



if (subCategory) {
  filtered = filtered.filter(
    product =>
      normalize(product.subcategory) === normalize(subCategory)
  );
}

console.log(
  filtered.map(p => ({
    title: p.title,
    category: p.category,
    subcategory: p.subcategory
  }))
);

return filtered;
}, [
  products,
  activeCategory,
  sortBy,
  category,
  subCategory,
]);

const comingSoonCategories = [
  "dry-fruits",
  "spices",
  "health-punch",
];

const isComingSoon =
  category &&
  comingSoonCategories.includes(category) &&
  filteredAndSortedProducts.length === 0;


  const handleAddToCart = async (e, product) => {
    console.log(product);
console.log("ID =", product._id);
  e.preventDefault();
  e.stopPropagation();

  try {
    const defaultVariant = product.variants?.[0];

    const formattedProduct = {
  _id: product._id,
  title: product.title,
  image: product.images?.[0] || "/images/logo.png",
  price: defaultVariant?.price || product.price,

  variants: [
    {
      _id: defaultVariant?._id || product._id,
      id: defaultVariant?._id || product._id,
      title: defaultVariant?.size || "Default",
      size: defaultVariant?.size || "",
      price: defaultVariant?.price || product.price,
      price_formatted: `₹${defaultVariant?.price || product.price}`,
      inventory_quantity: defaultVariant?.stock ?? 0,
      manage_inventory: true,
    },
  ],
};
    const token = localStorage.getItem("token");

    

await addToCart(
  formattedProduct,
  formattedProduct.variants[0],
  1,
  defaultVariant?.stock ?? 0
);

setAddedProductId(product._id);

setTimeout(() => {
  setAddedProductId(null);
}, 2000);

    toast({
      title: "Added to Cart! 🛒",
      description: `${product.title} has been added to your cart.`,
    });

  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed",
      description: error.message,
    });
  }
};

  return (
    <>
      <Helmet>
        <title>Shop Premium Products | SattViva Naturals</title>
        <meta name="description" content="Explore our complete collection of 100% pure wood pressed oils, dry fruits, and organic spices. Food the way nature intended." />
      </Helmet>

      <div className="bg-background min-h-screen pb-24">
        {/* Header Section */}
        <section className=" py-8 md:py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="heading-font text-5xl md:text-6xl font-bold mb-0.5  text-balance"
    >
      Premium Collections
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-base md:text-lg max-w-3xl mx-auto font-light leading-relaxed"
    >
      Discover 100% natural, traditionally processed staples for your everyday wellness.
    </motion.p>
  </div>
</section>

        {/* Filters & Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-card rounded-xl shadow-lg border border-border p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex gap-2 min-w-max">
           <div className="flex gap-2 min-w-max">
  {categories.map((cat) => (
    <Button
      key={cat}
      variant={activeCategory === cat ? "default" : "outline"}
      onClick={() => handleCategoryClick(cat)}
      className={
        activeCategory === cat
          ? "bg-secondary text-secondary-foreground rounded-full px-6"
          : "rounded-full px-6"
      }
    >
      {cat}
    </Button>
  ))}
</div>
  </div>
</div>
</div>
</section>
           

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {isComingSoon ? (

  <div className="flex flex-col items-center justify-center py-16">

    <img
      src="/images/coming-soon.png"
      alt="Coming Soon"
      className="w-[500px] max-w-full"
    />

    <h2 className="text-5xl font-bold text-green-700 mt-8">
      Coming Soon
    </h2>

    <p className="text-lg text-gray-600 mt-4 text-center max-w-xl">
      We're working hard to bring premium products to this category.
      Stay tuned for something healthy and exciting!
    </p>

  </div>

) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${category}-${subCategory}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAndSortedProducts.map((product, index) => (
                
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col premium-card relative"
                >
                  {/* <button className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur rounded-full text-muted-foreground hover:text-red-500 hover:bg-background transition-colors">
                    <Heart className="h-5 w-5" />
                  </button> */}
                  
                  <div className="relative overflow-hidden aspect-[4/3]">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.images?.[0] || "/images/logo.png"} 
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur px-3 py-1 rounded text-sm font-semibold shadow-sm">
                      {product.size}
                    </div>
                    </Link>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* <div className="flex items-center gap-1 mb-2 text-secondary">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-foreground">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div> */}
                    <Link to={`/product/${product._id}`} className="block">

                    <h3 className="heading-font text-2xl font-bold text-foreground mb-2 leading-tight">
                      {product.title}
                    </h3>
                    </Link>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div className="text-2xl font-bold text-primary">
                        ₹{product.price}
                      </div>
                      
                     {(product.variants?.[0]?.stock ?? 0) <= 0 && (
  <div className="mt-2 inline-block rounded-md bg-red-100 px-2 py-1">
    <p className="text-xs font-semibold text-red-700">
      Out of Stock
    </p>
  </div>
)}
<Button
  onClick={(e) => handleAddToCart(e, product)}
  disabled={
  addedProductId === product._id ||
  (product.variants?.[0]?.stock ?? 0) <= 0
}
  className={`font-semibold px-6 uppercase tracking-wide text-xs rounded-full transition-all duration-300 ${
(product.variants?.[0]?.stock ?? 0) <= 0
      ? "bg-gray-400 text-white cursor-not-allowed"
      : addedProductId === product._id
      ? "bg-green-600 hover:bg-green-600 text-white"
      : "bg-secondary hover:bg-secondary/90 text-secondary-foreground gold-glow"
  }`}
>
  <ShoppingCart className="mr-2 h-4 w-4" />

  {product.stock <= 0
    ? "Out of Stock"
    : addedProductId === product._id
    ? "Added ✓"
    : "Add to Cart"}
</Button>
                    </div>
                  </div>
                </motion.div>
                
              ))}
            </motion.div>
          </AnimatePresence>
)}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};


export default ProductCatalog;
