import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  type: 'base' | 'fruit' | 'crunch' | 'drizzle';
  price: number;
  inStock: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  isCustomizable: boolean;
  ingredients?: IIngredient[]; // For custom bowls
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  inStock: boolean;
  stockCount?: number;
}

const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  type: { type: String, enum: ['base', 'fruit', 'crunch', 'drizzle'], required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  isCustomizable: { type: Boolean, default: false },
  ingredients: [ingredientSchema],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number }
}, {
  timestamps: true
});

productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  if (typeof next === 'function') next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
