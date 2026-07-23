'use client';

import { useState } from 'react';
import { Leaf, Package, Star, Clock, MapPin, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useMyOrders } from '@/hooks/useOrders';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');
  
  const { user, logout } = useAuth();
  const { data: ordersData, isLoading: isLoadingOrders } = useMyOrders();
  const orders = ordersData?.data || [];
  
  // Fallback if not logged in (handled by protected routes in production, but good for safety here)
  const displayUser = user || {
    name: 'Guest User',
    email: 'guest@example.com',
    loyaltyPoints: 0,
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / User Info */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center text-foreground">{displayUser.name}</h2>
              <p className="text-muted-foreground text-center mb-6">{displayUser.email}</p>
              
              <div className="flex items-center justify-center gap-2 bg-secondary/10 text-secondary-foreground py-3 px-4 rounded-xl mb-8 border border-secondary/20">
                <Star className="w-5 h-5 text-secondary fill-secondary" />
                <span className="font-bold">{displayUser.loyaltyPoints} Loyalty Points</span>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                >
                  <Package className="w-5 h-5" /> Order History
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'addresses' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                >
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                >
                  <User className="w-5 h-5" /> Account Settings
                </button>
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium text-destructive hover:bg-destructive/10 mt-8"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            
            {activeTab === 'orders' && (
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Order History</h3>
                
                {isLoadingOrders ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-lg text-foreground">
                                #{order._id.substring(order._id.length - 6).toUpperCase()}
                              </span>
                              <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">{order.status}</span>
                            </div>
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                            </p>
                          </div>
                          <div className="text-xl font-bold text-primary">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                           <button className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                             View Details
                           </button>
                           <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                             Reorder
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Link href="/menu" className="text-primary font-bold hover:underline">Start Ordering</Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
               <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-foreground">Saved Addresses</h3>
                   <button className="text-primary font-medium hover:underline text-sm">+ Add New</button>
                 </div>
                 
                 <div className="border border-border rounded-2xl p-6 relative">
                   <span className="absolute top-4 right-4 text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                   <h4 className="font-bold text-foreground mb-2">Home</h4>
                   <p className="text-muted-foreground text-sm">{displayUser.name}</p>
                   <p className="text-muted-foreground text-sm mb-4">123 Fresh Ave, Apt 4B<br/>New York, NY 10001</p>
                   <div className="flex gap-4 text-sm font-medium">
                     <button className="text-primary hover:underline">Edit</button>
                     <button className="text-destructive hover:underline">Delete</button>
                   </div>
                 </div>
               </div>
            )}
            
            {activeTab === 'settings' && (
               <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                 <h3 className="text-2xl font-bold text-foreground mb-6">Account Settings</h3>
                 <p className="text-muted-foreground">Settings form will go here.</p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
