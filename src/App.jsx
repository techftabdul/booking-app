import { useState, useEffect } from "react";
import { services } from "./data/mockData";
import {
  fetchBookings,
  createBooking,
  cancelBooking,
  restoreBooking,
} from "./lib/bookingsApi";
import ServiceList from "./components/ServiceList";
import Calendar from "./components/Calender";
import TimeSlot from "./components/TimeSlot";
import BookingForm from "./components/BookingForm";
import Confirmation from "./components/Confirmation";
import Dashboard from "./components/Dashboard";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [step, setStep] = useState("services");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookings();
      setBookings(data);
      setLoadingBookings(false);
    };
    loadBookings();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const isDayFull =
    selectedDate && selectedService
      ? timeSlots.every((slot) =>
          bookings.some(
            (booking) =>
              booking.date === selectedDate &&
              booking.time === slot &&
              booking.service.id === selectedService.id,
          ),
        )
      : false;

  const isBookingValid = selectedDate && selectedTime && selectedService;

  async function handleConfirmBooking(newBooking) {
    try {
      setIsSaving(true);
      const savedBooking = await createBooking(newBooking);
      setBookings((prev) => [...prev, savedBooking]);
      setStep("confirmation");
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleSelectService(service) {
    setSelectedService(service);
    setStep("booking");
  }

  // handleDeleteBooking deletes a booking from the list & database and updates the state

  // async function handleDeleteBooking(id) {
  //   try {
  //     if (!window.confirm("Are you sure you want to cancel this booking?"))
  //       return;

  //     setDeletingId(id);
  //     await cancelBooking(id);
  //     setBookings((prev) =>
  //       prev.map((booking) =>
  //         booking.id === id ? { ...booking, status: "cancelled" } : booking,
  //       ),
  //     );
  //     setMessage("Booking cancelled successfully.");
  //   } catch (error) {
  //     console.error("Error deleting booking:", error);
  //   } finally {
  //     setDeletingId(null);
  //     setTimeout(() => setMessage(""), 3000);
  //   }
  // }

  // handleToggleCancel toggles the booking status between "cancelled" and "confirmed" based on the current status. It updates the state and calls the appropriate API function to reflect the change in the database.

  async function handleToggleCancel(id, currentStatus) {
    try {
      setDeletingId(id);
      if (currentStatus === "cancelled") {
        await restoreBooking(id);
      } else {
        await cancelBooking(id);
        setMessage("Booking cancelled.");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status:
                  currentStatus === "cancelled" ? "confirmed" : "cancelled",
              }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Error toggling booking status:", error);
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <>
      {step === "services" && (
        <>
          <h1 className="app-title">BookEase</h1>
          <p className="app-subtitle">
            Effortless booking for your favorite services
          </p>
        </>
      )}
      <div className="btn-header">
        <button onClick={() => setStep("services")}>Book Service</button>
        <button onClick={() => setStep("dashboard")}>Dashboard</button>
        {user && step === "dashboard" && (
          <button className="logout-button" onClick={() => auth.signOut()}>
            Logout
          </button>
        )}
      </div>
      {step === "services" && (
        <ServiceList services={services} onSelect={handleSelectService} />
      )}

      {step === "booking" && selectedService && (
        <>
          <h2>{selectedService?.name}</h2>
          <h3>{selectedService?.duration} minutes</h3>
          <h4>{selectedService?.price} USD</h4>
          {loadingBookings ? (
            <p>Loading available time slots...</p>
          ) : (
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
          <TimeSlot
            bookings={bookings}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedService={selectedService}
            selectedDate={selectedDate}
            timeSlots={timeSlots}
            isDayFull={isDayFull}
          />
          <BookingForm
            service={selectedService}
            onConfirm={handleConfirmBooking}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isBookingValid={isBookingValid}
            isSaving={isSaving}
          />
        </>
      )}

      {step === "confirmation" && selectedService && (
        <Confirmation
          selectedService={selectedService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onBookAnother={() => {
            setStep("services");
            setSelectedService(null);
            setSelectedDate(null);
            setSelectedTime(null);
          }}
          onViewDashboard={() => setStep("dashboard")}
        />
      )}
      {step === "dashboard" && user && (
        <Dashboard
          bookings={bookings}
          // onDelete={handleDeleteBooking}
          deletingId={deletingId}
          onToggleCancel={handleToggleCancel}
          loading={loadingBookings}
        />
      )}

      {step === "dashboard" && !user && (
        <Login onSuccess={() => setStep("dashboard")} />
      )}
      {message && <div className="message">{message}</div>}
      <div className="app-footer">
        <div className="footer-inner">
          <span className="location">Appointment Booking System</span>
          <span className="divider">|</span>
          <span className="brand">BookEase</span>
          <span className="divider">|</span>
          <span className="year">{new Date().getFullYear()}</span>
        </div>
        <div className="footer-note">
          <p>
            All rights reserved &copy;{" "}
            <span className="dev">
              <a href="https://x.com/techftabdul">techftabdul</a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
