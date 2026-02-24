export default function Confirmation({
  selectedService,
  selectedDate,
  selectedTime,
  onBookAnother,
  onViewDashboard,
}) {
  return (
    <div className="confirmation">
      <h2>Booking Confirmation</h2>
      <p>Your booking has been successfully scheduled 🎉!</p>
      <div className="booking-details">
        <h3>Booking Details</h3>
        <p>
          <strong>Service:</strong> {selectedService?.name}
        </p>
        <p>
          <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {selectedTime}
        </p>
      </div>
      <div className="confirmation-actions">
        <button className="primary" onClick={onBookAnother}>
          Book Another
        </button>
        <button className="secondary" onClick={onViewDashboard}>
          View Dashboard
        </button>
      </div>
    </div>
  );
}
