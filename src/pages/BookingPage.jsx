import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }


  const handleCancelBooking = async () => {
    try {
      const response = await axios.post('/cancel-booking', {
        bookingId: booking._id,
      });
      
      if (response.status === 200) {
        alert('Booking cancelled successfully.');
        navigate('/account/bookings');

        // Additional actions such as redirecting the user or updating the UI
      } else {
        alert('Failed to cancel the booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
      <button
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl mt-4 transition-all duration-300 ease-in-out"
        onClick={handleCancelBooking}
      >
        Cancel Booking
      </button>
    </div>
  );
}