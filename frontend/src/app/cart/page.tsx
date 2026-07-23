'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const delivery = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
          Looks like you haven't added any fresh bowls to your cart yet.
        </p>
        <Link 
          href="/menu" 
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold text-foreground mb-12">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden', margin: 0 }}
                  className="bg-card border border-border rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
                >
                  <div className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex-shrink-0 bg-secondary/10 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden`}>
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🥣</span>
                    )}
                  </div>
                  
                  <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                    <div className="flex justify-between items-start w-full mb-1">
                      <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                      <span className="font-bold text-lg text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <p className="text-sm font-medium text-muted-foreground mb-2">{item.type}</p>
                    
                    {item.description && (
                      <p className="text-xs text-muted-foreground mb-4 max-w-sm line-clamp-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between w-full mt-auto pt-4 sm:pt-0 border-t sm:border-0 border-border">
                      <div className="flex items-center bg-muted rounded-full p-1 border border-border/50">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-card rounded-full shadow-sm hover:text-primary transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-card rounded-full shadow-sm hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="text-foreground font-medium">${delivery.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
