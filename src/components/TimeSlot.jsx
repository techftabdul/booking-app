import { clsx } from "clsx";

export default function TimeSlot({
  selectedTime,
  setSelectedTime,
  bookings,
  selectedService,
  selectedDate,
  isDayFull,
  timeSlots,
}) {
  return (
    <div className="time-slots">
      <h2>Select a Time Slot</h2>
      <ul>
        {timeSlots.map((slot) => {
          const isBooked = bookings.some(
            (booking) =>
              booking.service.id === selectedService.id &&
              booking.date === selectedDate &&
              booking.time === slot,
          );

          return (
            <li key={slot}>
              <button
                disabled={isBooked || isDayFull}
                aria-label={`${slot} ${isBooked ? "booked" : "available"}`}
                onClick={() => setSelectedTime(slot)}
                className={clsx("time-slot", {
                  booked: isBooked,
                  selected: slot === selectedTime,
                })}
              >
                {slot}
              </button>
            </li>
          );
        })}
      </ul>
      {selectedTime && <i>Selected Time: {selectedTime}</i>}
      {isDayFull && <p>All time slots are booked for this day.</p>}
    </div>
  );
}
