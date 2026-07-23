'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  TrendingUp, 
  Package, 
  DollarSign,
  Search,
  Bell,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Revenue', value: '$24,562.00', change: '+14%', icon: <DollarSign className="w-6 h-6 text-green-500" /> },
    { label: 'Active Orders', value: '42', change: '+5%', icon: <ShoppingBag className="w-6 h-6 text-blue-500" /> },
    { label: 'Total Customers', value: '1,204', change: '+12%', icon: <Users className="w-6 h-6 text-purple-500" /> },
    { label: 'Low Stock Items', value: '3', change: '-2%', icon: <Package className="w-6 h-6 text-orange-500" /> },
  ];

  const recentOrders = [
    { id: '#FMB-4920', customer: 'Sarah Jenkins', amount: '$42.50', status: 'Preparing', time: '10 mins ago' },
    { id: '#FMB-4919', customer: 'Michael Chen', amount: '$15.99', status: 'Ready', time: '25 mins ago' },
    { id: '#FMB-4918', customer: 'Emma Watson', amount: '$31.00', status: 'Out for Delivery', time: '45 mins ago' },
    { id: '#FMB-4917', customer: 'David Smith', amount: '$22.50', status: 'Delivered', time: '1 hr ago' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
           <span className="text-xl font-bold tracking-tight text-primary">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
          >
            <ShoppingBag className="w-5 h-5" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'products' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
          >
            <Package className="w-5 h-5" /> Products & Inventory
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'customers' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
          >
            <Users className="w-5 h-5" /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
          >
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium text-foreground hover:bg-muted">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6 sm:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="p-2 text-muted-foreground hover:bg-muted rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary border-2 border-primary">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 sm:p-10 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-muted rounded-xl">{stat.icon}</div>
                      <span className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-extrabold text-foreground">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-bold text-foreground">Recent Orders</h3>
                    <button className="text-sm text-primary font-medium hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 text-muted-foreground text-sm">
                        <tr>
                          <th className="px-6 py-4 font-medium">Order ID</th>
                          <th className="px-6 py-4 font-medium">Customer</th>
                          <th className="px-6 py-4 font-medium">Amount</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentOrders.map((order, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                            <td className="px-6 py-4 text-muted-foreground">{order.customer}</td>
                            <td className="px-6 py-4 font-medium">{order.amount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                  order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }
                              `}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-sm">{order.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Popular Items / Low Stock */}
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">Top Items</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">🥣</div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Acai Paradise</p>
                        <p className="text-xs text-muted-foreground">124 orders today</p>
                      </div>
                      <span className="font-bold text-primary">$1,610</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">🥣</div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Tropical Sunrise</p>
                        <p className="text-xs text-muted-foreground">89 orders today</p>
                      </div>
                      <span className="font-bold text-primary">$1,067</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">🥣</div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Green Goddess</p>
                        <p className="text-xs text-muted-foreground">56 orders today</p>
                      </div>
                      <span className="font-bold text-primary">$755</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center min-h-[50vh]">
              <Settings className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2 capitalize">{activeTab} Module</h2>
              <p className="text-muted-foreground">This module is being built in Phase 5.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
