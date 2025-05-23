import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import BookingResponse from "../responses/booking";
import Booking from "../models/booking";
import { authorizeBookingForCustomer, createPayment, getUserFromRequest } from "../utils/helper";
import User from "../models/user";

export default class BookingController {
  dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to create a booking
    try {
      const { origin, destination } = req.body;
      const bookingCode = `${origin}-${destination}-${Date.now()}`;

      const booking = new Booking();
      booking.origin = req.body.origin;
      booking.destination = req.body.destination;
      booking.departureTime = req.body.departure_time;
      booking.estimationTimeArrival = req.body.estimation_time_arrival;
      booking.bookingCode = bookingCode;
      booking.price = req.body.price;
      booking.createdBy = req.body.created_by;

      const currentUser = await getUserFromRequest(req, this.dataSource);
      const reqUserId = req.body.user_id;
      const user = await this.dataSource.manager.findOneBy(User, {
        id: Number(reqUserId)
      });

      booking.user = user;
      const paymentResponse = await createPayment(booking);
      booking.invoiceUrl = paymentResponse.redirect_url;
      booking.transactionStatus = 'pending';
      booking.createdBy = currentUser;

      await this.dataSource.manager.save(booking);

      const bookingResponse: BookingResponse = {
        id: booking.id,
        origin: booking.origin,
        destination: booking.destination,
        departureTime: booking.departureTime,
        estimationTimeArrival: booking.estimationTimeArrival,
        bookingCode: booking.bookingCode,
        transactionStatus: booking.transactionStatus,
        invoiceUrl: booking.invoiceUrl,
        price: booking.price,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };

      res.status(201).json({
        message: "Booking created successfully",
        data: bookingResponse,
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

  async getBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to get a booking by ID

    try {
      const { id } = req.params;

      const booking = await this.dataSource.manager.findOneBy(Booking, {
        id: Number(id)
      });

      if (!booking) {
        res.status(404).json({
          message: "Booking not found",
          status: 404,
          data: null
        });
        return;
      }

      try {
        await authorizeBookingForCustomer(booking, req, this.dataSource);
      } catch (error: any) {
        res.status(403).json({
          message: "Unauthorized access to booking",
          status: 403,
          data: null
        });
        return;
      }

      const bookingResponse: BookingResponse = {
        id: booking.id,
        origin: booking.origin,
        destination: booking.destination,
        departureTime: booking.departureTime,
        estimationTimeArrival: booking.estimationTimeArrival,
        bookingCode: booking.bookingCode,
        transactionStatus: booking.transactionStatus,
        invoiceUrl: booking.invoiceUrl,
        price: booking.price,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }

      res.status(200).json({
        message: "Booking retrieved successfully",
        data: bookingResponse,
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

  async updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const booking = await this.dataSource.manager.findOneBy(Booking, {
        id: Number(req.params.id)
      });

      if (!booking) {
        res.status(404).json({
          message: "Booking not found",
          status: 404,
          data: null
        });
        return;
      }

      booking.origin = req.body.origin;
      booking.destination = req.body.destination;
      booking.departureTime = req.body.departure_time;
      booking.estimationTimeArrival = req.body.estimation_time_arrival;
      booking.price = req.body.price;

      const newBookingCode = `${req.body.origin}-${req.body.destination}-${Date.now()}`;
      booking.bookingCode = newBookingCode;

      const paymentResponse = await createPayment(booking);
      booking.invoiceUrl = paymentResponse.redirect_url;
      booking.transactionStatus = 'pending';

      await this.dataSource.manager.save(booking);

      const bookingResponse: BookingResponse = {
        id: booking.id,
        origin: booking.origin,
        destination: booking.destination,
        departureTime: booking.departureTime,
        estimationTimeArrival: booking.estimationTimeArrival,
        bookingCode: booking.bookingCode,
        transactionStatus: booking.transactionStatus,
        invoiceUrl: booking.invoiceUrl,
        price: booking.price,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };

      res.status(200).json({
        message: "Booking updated successfully",
        data: bookingResponse,
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

  async deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to delete a booking

    try {
      const { id } = req.params;

      const booking = await this.dataSource.manager.findOneBy(Booking, {
        id: Number(id)
      });

      if (!booking) {
        res.status(404).json({
          message: "Booking not found",
          status: 404,
          data: null
        });
        return;
      }

      await this.dataSource.manager.remove(booking);

      res.status(200).json({
        message: "Booking deleted successfully",
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

  async getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Logic to get all bookings

    try {
      const currentUser = await getUserFromRequest(req, this.dataSource);

      let queryParams: any = {
        user: {
          id: currentUser?.id
        }
      }

      if (currentUser?.role === "admin") {
        queryParams = {}
      }

      const bookings = await this.dataSource.manager.findBy(Booking, queryParams);

      res.status(200).json({
        message: "Bookings retrieved successfully",
        data: bookings,
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

  async handleUpdateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { order_id: bookingId, status, transaction_status } = req.body;
    // Logic to update the booking status

    try {

      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);

      const booking = await this.dataSource.manager.findOneBy(Booking, {
        bookingCode: bookingId
      });

      if (!booking) {
        res.status(404).json({
          message: "Booking not found",
          status: 404,
          data: null
        });
        return;
      }

      let transactionStatus: string = status === 'capture' ? 'paid' : 'other';

      if (transaction_status == 'settlement') {
        transactionStatus = 'paid';
      }

      booking.transactionStatus = transactionStatus;

      await this.dataSource.manager.save(booking);

      res.status(200).json({
        message: "Booking status updated successfully",
        data: booking,
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

