import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { User } from '../models/User';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Creating categories...');
    const categories = await Category.insertMany([
      { name: 'Signature Bowls', description: 'Our perfectly crafted fruit and grain bowls.' },
      { name: 'Smoothies', description: 'Fresh, blended, and packed with nutrients.' },
      { name: 'Oatmeal Bowls', description: 'Warm and hearty protein oatmeal.' },
      { name: 'Snacks', description: 'Quick healthy bites.' }
    ]);

    const signatureBowlsId = categories[0]._id;
    const smoothiesId = categories[1]._id;
    const oatmealBowlsId = categories[2]._id;
    const snacksId = categories[3]._id;

    console.log('Creating products...');
    
    const products = [
      {
        name: "Acai Paradise",
        description: "Organic acai blended with banana, topped with fresh berries, hemp granola, and honey.",
        price: 12.99,
        category: signatureBowlsId,
        isCustomizable: false,
        tag: "Best Seller",
        images: ["/images/acai-bowl.jpg"],
        nutritionalInfo: { calories: 450, protein: 8, carbs: 65, fat: 12 }
      },
      {
        name: "Tropical Sunrise",
        description: "Pink pitaya blend, topped with mango, kiwi, coconut flakes, and agave.",
        price: 11.99,
        category: signatureBowlsId,
        isCustomizable: false,
        images: ["/images/pitaya-bowl.jpg"],
        nutritionalInfo: { calories: 380, protein: 6, carbs: 55, fat: 8 }
      },
      {
        name: "Green Goddess",
        description: "Matcha green blend, banana, strawberries, chia seeds, and almond butter.",
        price: 13.49,
        category: signatureBowlsId,
        isCustomizable: false,
        tag: "Vegan",
        images: ["/images/matcha-bowl.jpg"],
        nutritionalInfo: { calories: 320, protein: 12, carbs: 45, fat: 15 }
      },
      {
        name: "Berry Blast",
        description: "A refreshing blend of strawberries, blueberries, and raspberries.",
        price: 8.99,
        category: smoothiesId,
        isCustomizable: false,
        images: ["/images/berry-smoothie.jpg"],
        nutritionalInfo: { calories: 250, protein: 4, carbs: 40, fat: 2 }
      },
      {
        name: "Classic PB & J",
        description: "Warm protein oatmeal topped with fresh berries and peanut butter.",
        price: 9.99,
        category: oatmealBowlsId,
        isCustomizable: false,
        images: ["/images/oatmeal-bowl.jpg"],
        nutritionalInfo: { calories: 520, protein: 18, carbs: 50, fat: 22 }
      },
      {
        name: "Energy Bites",
        description: "House-made protein balls with cacao, oats, and peanut butter.",
        price: 5.99,
        category: snacksId,
        isCustomizable: false,
        images: ["/images/energy-bites.jpg"],
        nutritionalInfo: { calories: 200, protein: 10, carbs: 20, fat: 12 }
      }
    ];

    await Product.insertMany(products);

    console.log('Creating Custom Bowl template...');
    
    // Create the customizable product
    await Product.create({
      name: "Custom Fresh Mix",
      description: "Build your own perfect bowl exactly how you want it.",
      price: 6.00, // Base price
      category: signatureBowlsId,
      isCustomizable: true,
      tag: "Build Your Own",
      ingredients: [
        // Bases
        { name: 'Organic Acai', type: 'base', price: 6.00, color: 'bg-purple-900', inStock: true },
        { name: 'Pink Pitaya', type: 'base', price: 6.50, color: 'bg-pink-500', inStock: true },
        { name: 'Matcha Green', type: 'base', price: 6.50, color: 'bg-green-500', inStock: true },
        { name: 'Coconut Vanilla', type: 'base', price: 6.00, color: 'bg-zinc-100', inStock: true },
        // Fruits
        { name: 'Strawberries', type: 'fruit', price: 1.00, color: 'bg-red-500', inStock: true },
        { name: 'Blueberries', type: 'fruit', price: 1.00, color: 'bg-blue-600', inStock: true },
        { name: 'Banana', type: 'fruit', price: 0.50, color: 'bg-yellow-400', inStock: true },
        { name: 'Mango', type: 'fruit', price: 1.50, color: 'bg-orange-400', inStock: true },
        { name: 'Kiwi', type: 'fruit', price: 1.00, color: 'bg-lime-500', inStock: true },
        // Crunches
        { name: 'Hemp Granola', type: 'crunch', price: 1.00, color: 'bg-amber-700', inStock: true },
        { name: 'Chia Seeds', type: 'crunch', price: 0.50, color: 'bg-zinc-800', inStock: true },
        { name: 'Coconut Flakes', type: 'crunch', price: 0.75, color: 'bg-white', inStock: true },
        { name: 'Almonds', type: 'crunch', price: 1.00, color: 'bg-amber-800', inStock: true },
        { name: 'Cacao Nibs', type: 'crunch', price: 1.25, color: 'bg-stone-800', inStock: true },
        // Drizzles
        { name: 'Honey', type: 'drizzle', price: 0.50, color: 'bg-amber-400', inStock: true },
        { name: 'Peanut Butter', type: 'drizzle', price: 1.00, color: 'bg-amber-600', inStock: true },
        { name: 'Almond Butter', type: 'drizzle', price: 1.50, color: 'bg-amber-700', inStock: true },
        { name: 'Nutella', type: 'drizzle', price: 1.00, color: 'bg-stone-700', inStock: true },
        { name: 'Agave', type: 'drizzle', price: 0.75, color: 'bg-yellow-200', inStock: true }
      ]
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
