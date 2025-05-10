import 'dotenv/config';
import { Request } from 'express';
import UserResponse from '../responses/user';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { DataSource } from 'typeorm';
import Booking from '../models/booking';
import axios from 'axios';

const { SECRET_KEY, MIDTRANS_SERVER_KEY, SNAP_URL } = process.env;

type PaymentPayload = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  }
  credit_card: {
    secure: boolean;
  };
  customer_details: {
    first_name: string;
    email: string;
  };
  item_details?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

type PaymentResponse = {
  token: string;
  redirect_url: string;
}

async function createPayment(booking: Booking): Promise<PaymentResponse> {
  try {
    const bookingCode = booking.bookingCode;
    const price = booking.price;

    const authPassword = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

    const payload: PaymentPayload = {
      transaction_details: {
        order_id: bookingCode,
        gross_amount: price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: booking.user?.name || '',
        email: booking.user?.email || '',
      },
      item_details: [{
        id: booking.bookingCode,
        price: price,
        quantity: 1,
        name: `Booking from ${booking.origin} to ${booking.destination}`,
      }],
    };

    const snapUrl = SNAP_URL as string

    const paymentResponse = await axios.post<PaymentResponse>(snapUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authPassword}`,
      }
    })

    console.log('Payment response:', paymentResponse.data);

    return paymentResponse.data;
  } catch (error: any) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
}

async function authorizeBookingForCustomer(booking: Booking, req: Request, dataSource: DataSource): Promise<void> {
  const currentUser = await getUserFromRequest(req, dataSource);
  const role: string | undefined = currentUser?.role

  if (role === 'admin') return;

  const bookingUserId = booking.user?.id;
  const currentUserId = currentUser?.id;

  if (bookingUserId !== currentUserId) {
    throw new Error('Unauthorized access to booking');
  }
}

async function getUserFromRequest(req: Request, dataSource: DataSource): Promise<User | null> {
  const token = req.headers['authorization']?.split(' ')[1] as string;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET_KEY || '') as UserResponse;

    const id = decoded.id;
    const user = await dataSource.manager.findOne(User, {
      where: { id },
    });

    return user;
  } catch (error) {
    return null;
  }
}


export { getUserFromRequest, authorizeBookingForCustomer, createPayment };