type BookingResponse = {
  id: number
  origin: string
  destination: string
  departureTime: Date
  estimationTimeArrival: Date
  bookingCode: string
  transactionStatus: string
  invoiceUrl: string
  price: number
  createdAt: Date
  updatedAt: Date
}

export default BookingResponse