import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { DataSource } from 'typeorm';
import UserResponse from '../responses/user';
import path from "path";


if (process.env.NODE_ENV !== 'production') {
  try {
    config({ path: path.resolve(__dirname, '../../.env') });
  } catch (error: any) {
    console.error("Error loading .env file", error);
  }
}


const { SALT_ROUNDS, SECRET_KEY } = process.env;

export default class UserController {
  dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  // Define your methods here

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to create a user

    try {

      const { name, email, password } = req.body;
      const role: string = req.body.role || "customer";

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = bcrypt.hashSync(password, Number(SALT_ROUNDS));
      user.role = role;

      await this.dataSource.manager.save(user);

      const authToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY as string,
        { expiresIn: '5h' }
      );

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        authToken: authToken
      };

      res.status(201).json({
        message: "User created successfully",
        data: userResponse,
        status: 201,
      });

    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to log in a user
    try {
      const { email, password } = req.body;

      const user = await this.dataSource.manager.findOneBy(User, {
        email: email
      });


      if (!user) {
        res.status(404).json({
          message: "User not found",
          status: 404,
          data: null
        });
        return;
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          message: "Invalid password",
          status: 401,
          data: null
        });
        return;
      }

      const authToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY as string,
        { expiresIn: '5h' }
      );

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        authToken: authToken
      };

      res.status(200).json({
        message: "Login successful",
        data: userResponse,
        status: 200,
      });

    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const { name } = req.body;
      const { id } = req.params;

      const user = await this.dataSource.manager.findOneBy(User, {
        id: Number(id)
      });

      if (!user) {
        res.status(404).json({
          message: "User not found",
          status: 404,
          data: null
        });
        return;
      }

      user.name = name;
      await this.dataSource.manager.save(user);

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      res.status(200).json({
        message: "User updated successfully",
        data: userResponse,
        status: 200,
      });

    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const { id } = req.params;
      const user = await this.dataSource.manager.findOneBy(User, {
        id: Number(id)
      });

      if (!user) {
        res.status(404).json({
          message: "User not found",
          status: 404,
          data: null
        });
        return;
      }

      await this.dataSource.manager.remove(user);

      res.status(200).json({
        message: "User deleted successfully",
        status: 200,
      });

    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.dataSource.manager.findOneBy(User, {
        id: Number(id)
      });

      if (!user) {
        res.status(404).json({
          message: "User not found",
          status: 404,
          data: null
        });
        return;
      }

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      res.status(200).json({
        message: "User retrieved successfully",
        data: userResponse,
        status: 200,
      });

    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        status: 500,
      });
    }
  }
}

