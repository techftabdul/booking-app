import { useState } from "react";
import { clsx } from "clsx";

export default function BookingForm({
  service,
  onConfirm,
  selectedDate,
  selectedTime,
  isBookingValid,
  isSaving,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!isBookingValid) return;

    onConfirm({
      service,
      date: selectedDate,
      time: selectedTime,
      name,
      email,
      phone,
      status: "confirmed",
    });
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Booking Details</h2>
      <p className="booking-info">Time: {selectedTime}</p>
      <p className="booking-info">Service: {service?.name}</p>
      <p className="booking-info">Date: {selectedDate}</p>
      <input
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="booking-input"
      />
      <input
        type="email"
        placeholder="john.doe@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="booking-input"
      />
      <input
        type="tel"
        placeholder="+974 1234 5678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="booking-input"
      />
      <button
        type="submit"
        disabled={!isBookingValid || isSaving}
        className={clsx("confirm-button", {
          disabled: !isBookingValid,
        })}
      >
        {isSaving ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}
