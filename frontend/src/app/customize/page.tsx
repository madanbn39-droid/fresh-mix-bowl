'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import Image from 'next/image';

const STEPS = [
  { id: 'base', title: 'Choose Base', limit: 1 },
  { id: 'fruits', title: 'Add Fruits', limit: 3 },
  { id: 'crunches', title: 'Add Crunches', limit: 2 },
  { id: 'drizzles', title: 'Add Drizzles', limit: 1 },
];

const INGREDIENTS = {
  base: [
    { id: 'b1', name: 'Organic Acai', price: 6.00, color: 'bg-purple-900', image: '/images/bases/acai-base.jpg' },
    { id: 'b2', name: 'Pink Pitaya', price: 6.50, color: 'bg-pink-500', image: '/images/bases/pitaya-base.jpg' },
    { id: 'b3', name: 'Matcha Green', price: 6.50, color: 'bg-green-500', image: '/images/bases/matcha-base.jpg' },
    { id: 'b4', name: 'Coconut Vanilla', price: 6.00, color: 'bg-zinc-100', image: '/images/bases/coconut-base.jpg' },
  ],
  fruits: [
    { id: 'f1', name: 'Strawberries', price: 1.00, color: 'bg-red-500' },
    { id: 'f2', name: 'Blueberries', price: 1.00, color: 'bg-blue-600' },
    { id: 'f3', name: 'Banana', price: 0.50, color: 'bg-yellow-400' },
    { id: 'f4', name: 'Mango', price: 1.50, color: 'bg-orange-400' },
    { id: 'f5', name: 'Kiwi', price: 1.00, color: 'bg-lime-500' },
    { id: 'f6', name: 'Pineapple', price: 1.00, color: 'bg-yellow-300' },
  ],
  crunches: [
    { id: 'c1', name: 'Hemp Granola', price: 1.00, color: 'bg-amber-700' },
    { id: 'c2', name: 'Chia Seeds', price: 0.50, color: 'bg-zinc-800' },
    { id: 'c3', name: 'Coconut Flakes', price: 0.75, color: 'bg-white border' },
    { id: 'c4', name: 'Almonds', price: 1.00, color: 'bg-amber-800' },
    { id: 'c5', name: 'Cacao Nibs', price: 1.25, color: 'bg-stone-800' },
  ],
  drizzles: [
    { id: 'd1', name: 'Honey', price: 0.50, color: 'bg-amber-400' },
    { id: 'd2', name: 'Peanut Butter', price: 1.00, color: 'bg-amber-600' },
    { id: 'd3', name: 'Almond Butter', price: 1.50, color: 'bg-amber-700' },
    { id: 'd4', name: 'Nutella', price: 1.00, color: 'bg-stone-700' },
    { id: 'd5', name: 'Agave', price: 0.75, color: 'bg-yellow-200' },
  ]
};

export default function CustomizePage() {
  const { data: productsData, isLoading } = useProducts();
  const products = productsData?.data || [];
  const customProduct = products.find((p: any) => p.isCustomizable);

  // Group fetched ingredients by type, or fallback to mock data if not seeded
  const dynamicIngredients = {
    base: customProduct?.ingredients?.filter((i: any) => i.type === 'base') || INGREDIENTS.base,
    fruits: customProduct?.ingredients?.filter((i: any) => i.type === 'fruit') || INGREDIENTS.fruits,
    crunches: customProduct?.ingredients?.filter((i: any) => i.type === 'crunch') || INGREDIENTS.crunches,
    drizzles: customProduct?.ingredients?.filter((i: any) => i.type === 'drizzle') || INGREDIENTS.drizzles,
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    base: [],
    fruits: [],
    crunches: [],
    drizzles: [],
  });

  const currentStep = STEPS[currentStepIndex];
  
  // Calculate total price
  const totalPrice = Object.entries(selections).reduce((total, [category, selectedIds]) => {
    const items = dynamicIngredients[category as keyof typeof dynamicIngredients] || [];
    const categoryTotal = selectedIds.reduce((sum, id) => {
      const item = items.find((i: any) => i.id === id || i._id === id);
      return sum + (item?.price || 0);
    }, 0);
    return total + categoryTotal;
  }, 0);

  const handleSelect = (categoryId: string, itemId: string, limit: number) => {
    setSelections(prev => {
      const currentCategorySelection = prev[categoryId];
      
      // If already selected, remove it
      if (currentCategorySelection.includes(itemId)) {
        return {
          ...prev,
          [categoryId]: currentCategorySelection.filter(id => id !== itemId)
        };
      }
      
      // If limit reached, replace the last one or prevent adding (depending on UX choice, here we replace if limit is 1)
      if (currentCategorySelection.length >= limit) {
        if (limit === 1) {
          return { ...prev, [categoryId]: [itemId] }; // Replace
        }
        return prev; // Prevent adding if limit reached
      }
      
      // Add item
      return {
        ...prev,
        [categoryId]: [...currentCategorySelection, itemId]
      };
    });
  };

  const isNextDisabled = currentStep.id === 'base' && selections.base.length === 0;

  return (
    <div className="min-h-screen bg-background pt-8 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Craft Your Perfect Bowl</h1>
          <p className="text-lg text-muted-foreground">Follow the steps below to build your custom Fresh Mix.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between relative z-10">
            {STEPS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : isCompleted
                          ? 'bg-primary/20 text-primary border-primary'
                          : 'bg-card text-muted-foreground border-border'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`text-xs md:text-sm font-medium hidden sm:block ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Selection Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
                    <p className="text-muted-foreground">Select up to {currentStep.limit} item(s)</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {selections[currentStep.id].length} / {currentStep.limit} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(dynamicIngredients[currentStep.id as keyof typeof dynamicIngredients] || []).map((item: any) => {
                    const itemId = item._id || item.id;
                    const isSelected = selections[currentStep.id].includes(itemId);
                    const isDisabled = !isSelected && selections[currentStep.id].length >= currentStep.limit && currentStep.limit > 1;
                    
                    // Fallback to INGREDIENTS mock if database item lacks image/color
                    const mockItem = INGREDIENTS[currentStep.id as keyof typeof INGREDIENTS]?.find(i => i.name === item.name);
                    const displayImage = mockItem?.image;
                    const displayColor = mockItem?.color || item.color || 'bg-primary/20';

                    return (
                      <button
                        key={itemId}
                        disabled={isDisabled}
                        onClick={() => handleSelect(currentStep.id, itemId, currentStep.limit)}
                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : isDisabled
                              ? 'border-border/50 bg-muted/30 opacity-50 cursor-not-allowed'
                              : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className={`relative w-16 h-16 rounded-full shadow-inner border border-black/10 flex items-center justify-center overflow-hidden ${displayColor}`}>
                           {displayImage && (
                             <Image src={displayImage} alt={item.name} fill className="object-cover" />
                           )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.name}</p>
                          <p className="text-muted-foreground text-xs">+${item.price.toFixed(2)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center border-t border-border pt-8">
              <button
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              
              {currentStepIndex < STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.min(STEPS.length - 1, prev + 1))}
                  disabled={isNextDisabled}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-bold hover:bg-secondary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </Link>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Your Bowl</h3>
              
              <div className="space-y-6 flex-grow">
                {STEPS.map(step => {
                  const selectedItems = selections[step.id].map(id => 
                    dynamicIngredients[step.id as keyof typeof dynamicIngredients]?.find((i: any) => (i._id || i.id) === id)
                  ).filter(Boolean);

                  return (
                    <div key={step.id}>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{step.title}</h4>
                      {selectedItems.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedItems.map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-sm">
                              <span className="text-foreground font-medium">{item?.name}</span>
                              <span className="text-muted-foreground">${item?.price.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">None selected</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground font-medium">Total</span>
                  <span className="text-3xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
