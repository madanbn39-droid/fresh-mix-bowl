'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
      isCustomizable: product.isCustomizable
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const products = productsData?.data || [];
  const categoriesList = categoriesData?.data || [];
  const categories = ['All', ...categoriesList.map((c: any) => c.name)];

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = activeCategory === 'All' || product.category?.name === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Discover our carefully crafted selection of healthy, delicious, and nutrient-packed options.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card text-foreground border border-border hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoadingProducts ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading menu...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredProducts.map((product: any) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product._id}
                  className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow group"
                >
                  <div className="relative w-full aspect-square bg-muted p-6 flex items-center justify-center">
                     {/* Placeholder for Product Image */}
                    {product.images && product.images.length > 0 ? (
                      <div className="w-4/5 h-4/5 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500 relative">
                        <Image 
                          src={product.images[0]} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border-4 border-white/50 shadow-inner group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <span className="text-4xl">🥣</span>
                      </div>
                    )}
                    {product.tag && (
                      <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {product.nutritionalInfo?.calories || 0} kcal • {product.category?.name}
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="p-3 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-6 text-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
