import "reflect-metadata";
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import UserController from './controllers/user';
import AppDataSource from './configs/datasource';
import BookingController from './controllers/booking';
import { authorize, authorizeAdmin, authorizeCustomerOwnData } from './middlewares/authorize';

AppDataSource.initialize().then(datasource => {
  console.log("Connected to the database");

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  const userController = new UserController(datasource);
  const bookingController = new BookingController(datasource);

  // User API endpoints
  app.post(
    '/api/v1/users',
    authorize,
    authorizeAdmin,
    (req, res, next) => userController.createUser(req, res, next)
  );

  app.post('/api/v1/users/login', (req, res, next) => userController.loginUser(req, res, next));
  app.get(
    '/api/v1/users/:id',
    authorize,
    authorizeCustomerOwnData,
    (req, res, next) => userController.getUser(req, res, next)
  );

  app.put(
    '/api/v1/users/:id',
    authorize,
    authorizeCustomerOwnData,
    (req, res, next) => userController.updateUser(req, res, next)
  );
  app.delete(
    '/api/v1/users/:id',
    authorizeAdmin,
    (req, res, next) => userController.deleteUser(req, res, next)
  );

  // Bookings API endpoints
  app.get(
    '/api/v1/bookings/:id',
    authorize,
    (req, res, next) => bookingController.getBooking(req, res, next)
  )
  app.delete(
    '/api/v1/bookings/:id',
    authorize,
    authorizeAdmin,
    (req, res, next) => bookingController.deleteBooking(req, res, next)
  )
  app.post(
    '/api/v1/bookings',
    authorize,
    authorizeAdmin,
    (req, res, next) => bookingController.createBooking(req, res, next)
  )
  app.put(
    '/api/v1/bookings/:id',
    authorize,
    authorizeAdmin,
    (req, res, next) => bookingController.updateBooking(req, res, next)
  );

  app.post('/api/v1/bookings/status', (req, res, next) => bookingController.handleUpdateBookingStatus(req, res, next));

  app.get(
    '/api/v1/bookings',
    authorize,
    (req, res, next) => bookingController.getAllBookings(req, res, next)
  );

  // Health check endpoint
  app.get('/api/v1/health', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: 'Server is running',
      status: 200,
    });
  });

  app.listen(port, _ => {
    console.log(`Server running at http://localhost:${port}`);
  });

}).catch((err) => {
  console.error("Error during Data Source initialization", err);
});

