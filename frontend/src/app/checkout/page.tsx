'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Valid Zip Code is required'),
  paymentMethod: z.enum(['card', 'cash']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'card',
    }
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = (data: CheckoutFormValues) => {
    setServerError('');
    
    const orderPayload = {
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity
      })),
      deliveryAddress: {
        street: data.address,
        city: data.city,
        zipCode: data.zipCode,
      },
      paymentMethod: data.paymentMethod
    };

    createOrder(orderPayload, {
      onSuccess: () => {
        setIsSubmitted(true);
        clearCart();
      },
      onError: (error: any) => {
        setServerError(error.response?.data?.message || 'Failed to place order.');
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-success" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
          Thank you for choosing Fresh Mix Bowl. Your healthy and delicious bowl is being prepared.
        </p>
        
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-border text-sm">
            <span className="text-muted-foreground">Order Number</span>
            <span className="font-bold text-foreground">#FMB-{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Estimated Delivery</span>
            <span className="font-bold text-foreground">25-35 mins</span>
          </div>
        </div>

        <Link 
          href="/" 
          className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const delivery = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + delivery;

  if (!isSubmitted && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
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
        
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              
              {serverError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                  {serverError}
                </div>
              )}

              {/* Contact Info */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                  <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-sm">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <input 
                      {...register('firstName')} 
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.firstName ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-destructive text-xs font-medium mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <input 
                      {...register('lastName')} 
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.lastName ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-destructive text-xs font-medium mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input 
                      {...register('email')} 
                      type="email"
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-destructive text-xs font-medium mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <input 
                      {...register('phone')} 
                      type="tel"
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.phone ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-destructive text-xs font-medium mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                  <h2 className="text-2xl font-bold text-foreground">Delivery Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-sm">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        {...register('address')} 
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.address ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                        placeholder="123 Fresh Ave, Apt 4B"
                      />
                    </div>
                    {errors.address && <p className="text-destructive text-xs font-medium mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">City</label>
                    <input 
                      {...register('city')} 
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.city ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-destructive text-xs font-medium mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Zip Code</label>
                    <input 
                      {...register('zipCode')} 
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.zipCode ? 'border-destructive focus:ring-destructive/50' : 'border-border'}`} 
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-destructive text-xs font-medium mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                  <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>
                </div>
                
                <div className="p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-sm space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                    <input type="radio" value="card" {...register('paymentMethod')} className="w-5 h-5 text-primary focus:ring-primary" />
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-semibold text-foreground">Pay with Card</p>
                      <p className="text-sm text-muted-foreground">Stripe / Razorpay secure checkout</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                    <input type="radio" value="cash" {...register('paymentMethod')} className="w-5 h-5 text-primary focus:ring-primary" />
                    <ShoppingBag className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </section>

              {/* Hidden submit button to trigger from summary card if needed, or place it here */}
              <div className="hidden lg:block">
                {/* Submit button is in the summary card for desktop */}
              </div>

            </form>
          </div>
          
          {/* Order Summary & Submit */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="relative w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center border-2 border-white text-xl overflow-hidden">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <span className="text-xl">🥣</span>
                          )}
                       </div>
                       <div>
                         <p className="font-bold text-sm text-foreground line-clamp-1">{item.name}</p>
                         <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                       </div>
                    </div>
                    <span className="font-medium text-sm text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 text-sm border-t border-border pt-4">
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
              
              <div className="pt-6 border-t border-border mb-8 bg-muted/30 -mx-6 px-6 pb-6 rounded-b-3xl">
                <div className="flex justify-between items-end mb-6 pt-6">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreatingOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingOrder ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    <span>Place Order</span>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
