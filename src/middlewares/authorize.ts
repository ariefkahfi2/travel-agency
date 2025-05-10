import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserResponse from '../responses/user';

const { SECRET_KEY } = process.env;

function decodeToken(req: Request): UserResponse | null {
  try {
    const token = req.headers['authorization']?.split(' ')[1] as string;

    if (!token) {
      return null;
    }

    const decoded: UserResponse = jwt.verify(token, SECRET_KEY || '') as UserResponse;

    const userResponse: UserResponse = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt,
    };

    if (!userResponse) {
      return null;
    }

    return userResponse;
  } catch (error: any) {
    return null;
  }
}

async function authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Invalid authorization token',
        status: 401,
      });

      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY || '');

    if (!decoded) {
      res.status(401).json({
        message: 'Invalid authorization token',
        status: 401,
      });

      return;
    }
    next();

  } catch (error: any) {
    res.status(401).json({
      message: 'Invalid authorization token',
      error: error.message,
      status: 401,
    });
  }
}

async function authorizeAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers['authorization']?.split(' ')[1] as string;
    const decoded = jwt.verify(token, SECRET_KEY || '') as UserResponse;

    const userRole = decoded?.role;
    if (userRole !== 'admin') {
      res.status(403).json({
        message: 'Forbidden',
        status: 403,
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      message: 'Invalid authorization token',
      error: error.message,
      status: 401,
    });
  }
}

async function authorizeCustomerOwnData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers['authorization']?.split(' ')[1] as string;
    const decoded = jwt.verify(token, SECRET_KEY || '') as UserResponse;

    const role = decoded?.role;
    if (role !== 'customer') {
      return next();
    }

    const userId = decoded?.id;
    const customerId = req.params.id;

    if (userId != parseInt(customerId)) {
      res.status(403).json({
        message: 'Forbidden',
        status: 403,
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      message: 'Invalid authorization token',
      error: error.message,
      status: 401,
    });
  }
}

export { authorize, decodeToken, authorizeAdmin, authorizeCustomerOwnData };