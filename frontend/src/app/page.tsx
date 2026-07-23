'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Zap, Heart } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "100% Organic",
      description: "Locally sourced, pesticide-free fruits handpicked daily for maximum freshness."
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: "Energy Boost",
      description: "Packed with superfoods and vitamins to keep you energized throughout the day."
    },
    {
      icon: <Heart className="w-8 h-8 text-destructive" />,
      title: "Made with Love",
      description: "Every bowl is crafted to perfection, ensuring a delightful and healthy experience."
    }
  ];

  const featuredBowls = [
    {
      name: "Acai Paradise",
      description: "Pure acai topped with strawberries, blueberries, banana, granola, and honey.",
      price: "$12.99",
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Tropical Sunrise",
      description: "Mango, pineapple, and pitaya base topped with kiwi, coconut flakes, and chia seeds.",
      price: "$11.99",
      color: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      name: "Green Goddess",
      description: "Spinach, kale, banana, and matcha base topped with almonds, hemp seeds, and fresh berries.",
      price: "$13.49",
      color: "bg-green-100 dark:bg-green-900/30",
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-background">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm w-fit border border-primary/20">
              New: Build Your Own Bowl 🥣
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Health in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Every Bite.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Experience the freshest, most vibrant fruit bowls in town. Premium ingredients, crafted perfectly for your healthy lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link 
                href="/menu" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
              >
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/customize" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-card text-foreground rounded-full font-semibold text-lg border border-border hover:bg-muted transition-all hover:scale-105 active:scale-95"
              >
                Customize Bowl
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / 3D Element Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none flex items-center justify-center"
          >
            {/* We will replace this with a real image later, for now a beautiful gradient circle representing a bowl */}
            <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/80 to-secondary/80 shadow-2xl flex items-center justify-center border-4 border-background overflow-hidden relative animate-[spin_60s_linear_infinite]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-[10%] right-[10%] glass px-4 py-2 rounded-2xl font-bold text-foreground shadow-lg"
            >
              ⭐ 4.9/5
            </motion.div>
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[15%] left-[5%] glass px-4 py-2 rounded-2xl font-bold text-foreground shadow-lg flex items-center gap-2"
            >
              <Leaf className="w-4 h-4 text-primary" /> Fresh Daily
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Fresh Mix Bowl?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We don't compromise on quality. Every bowl is a testament to our commitment to health, taste, and the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-3xl shadow-sm border border-border flex flex-col items-center text-center gap-4 transition-shadow hover:shadow-md"
              >
                <div className="p-4 bg-muted rounded-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bowls */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Signature Bowls</h2>
              <p className="text-muted-foreground text-lg">Curated by our expert nutritionists.</p>
            </div>
            <Link href="/menu" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:underline">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBowls.map((bowl, index) => (
              <div key={index} className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300">
                <div className={`w-full aspect-[4/3] ${bowl.color} flex items-center justify-center relative overflow-hidden`}>
                  {/* Placeholder for bowl image */}
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-inner group-hover:scale-110 transition-transform duration-500"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground">{bowl.name}</h3>
                    <span className="font-bold text-lg text-primary">{bowl.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-6 flex-grow">{bowl.description}</p>
                  <button className="w-full py-3 bg-secondary/10 text-secondary-foreground font-semibold rounded-xl border border-secondary/20 hover:bg-secondary hover:text-white transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link href="/menu" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20 -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Craving Something Unique?</h2>
          <p className="text-xl text-white/80 mb-10">
            Build your perfect fruit bowl from scratch. Choose your base, pick your favorite fruits, and top it off with our premium crunches and drizzles.
          </p>
          <Link 
            href="/customize" 
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-primary rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Start Customizing <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
