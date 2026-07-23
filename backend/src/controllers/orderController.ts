import { Request, Response, NextFunction } from 'express';
import { Order, OrderStatus, PaymentStatus } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Calculate prices and verify products
    let subTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      // Check stock
      if (!product.inStock) {
        return res.status(400).json({ success: false, message: `Product ${product.name} is out of stock` });
      }

      let itemPrice = product.price;

      // Handle custom ingredients if product is customizable
      if (product.isCustomizable && item.customIngredients && item.customIngredients.length > 0) {
        const customIngredientsCost = item.customIngredients.reduce((sum: number, ingredientId: any) => {
          const ingredient = product.ingredients?.find(i => i._id?.toString() === ingredientId.toString());
          return sum + (ingredient ? ingredient.price : 0);
        }, 0);
        itemPrice += customIngredientsCost;
      }

      subTotal += itemPrice * item.quantity;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: itemPrice,
        customIngredients: item.customIngredients
      });
    }

    const tax = subTotal * 0.08; // 8% tax
    const deliveryFee = 4.99;
    const totalAmount = subTotal + tax + deliveryFee;

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      subTotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      specialInstructions
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user?._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow admin or the user who placed the order to view it
    if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
