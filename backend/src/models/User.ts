import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum Role {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  STAFF = 'staff',
  DELIVERY = 'delivery',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  addresses: {
    street: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
  }[];
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false }, // Select false to not return in normal queries
  role: { type: String, enum: Object.values(Role), default: Role.CUSTOMER },
  addresses: [addressSchema],
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') return next();
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Generate referral code if new
    if (this.isNew && !this.referralCode) {
      this.referralCode = `FMB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    if (typeof next === 'function') next();
  } catch (error: any) {
    if (typeof next === 'function') next(error);
    else throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
