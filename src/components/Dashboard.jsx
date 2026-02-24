import { clsx } from "clsx";
import { useState } from "react";

export default function Dashboard({
  bookings,
  onToggleCancel,
  deletingId,
  loading,
}) {
  const [filter, setFilter] = useState("all");

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA - dateB;
  });

  const now = new Date();

  const filteredBookings = sortedBookings.filter((booking) => {
    const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
    if (filter === "cancelled") return booking.status === "cancelled";
    if (filter === "upcoming") return bookingDateTime >= now;
    if (filter === "past") return bookingDateTime < now;
    return true;
  });

  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
    return bookingDateTime >= now && booking.status !== "cancelled";
  });

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Admin Dashboard</h2>
        <p className="loading">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <p>View and manage scheduled bookings</p>
      <div className="dashboard-filter">
        <button>Filters </button>
        <button
          className={filter === "upcoming" ? "active" : ""}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={filter === "past" ? "active" : ""}
          onClick={() => setFilter("past")}
        >
          Past
        </button>
        <button
          className={filter === "cancelled" ? "active" : ""}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
      </div>
      <div className="dashboard-stats">
        <div className="stat">
          <div className="stat-value">{totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat">
          <div className="stat-value">{upcomingBookings.length}</div>
          <div className="stat-label">Upcoming Bookings</div>
        </div>
        <div className="stat">
          <div className="stat-value">{cancelledBookings}</div>
          <div className="stat-label">Cancelled Bookings</div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty">
          <h3>
            {filter === "cancelled" && "No cancelled bookings."}
            {filter === "upcoming" && "No upcoming bookings."}
            {filter === "past" && "No past bookings."}
            {filter === "all" && "No bookings yet."}
          </h3>

          <p>
            {filter === "cancelled" && "Cancelled bookings can be restored."}
            {filter === "upcoming" && "You can manage upcoming bookings here."}
            {filter === "past" && "You can view past bookings here."}
            {filter === "all" &&
              "You can view all bookings here once scheduled."}
          </p>
        </div>
      ) : (
        <ul className="booking-list">
          {filteredBookings.map((booking) => {
            const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
            const now = new Date();
            const isPast = bookingDateTime < now;
            const bookingDate = new Date(booking.date);
            const today = new Date();

            today.setHours(0, 0, 0, 0);
            bookingDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(
              (bookingDate - today) / (1000 * 60 * 60 * 24),
            );

            let dayLabel;
            if (diffDays === 0) {
              dayLabel = "Today";
            } else if (diffDays === 1) {
              dayLabel = "Tomorrow";
            } else {
              dayLabel = bookingDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }
            return (
              <li
                key={booking.id}
                className={clsx("booking-card", {
                  cancelled: booking.status === "cancelled",
                  past: isPast && booking.status !== "cancelled",
                  upcoming: !isPast && booking.status !== "cancelled",
                })}
              >
                <div className="booking-top">
                  <div className="booking-main">
                    <span className="booking-service">
                      {booking.service.name}
                    </span>
                    <span className="booking-datetime">
                      {dayLabel} - {booking.time}
                    </span>
                  </div>
                  <button
                    className={clsx("status", {
                      confirmed: booking.status === "confirmed" && !isPast,
                      cancelled: booking.status === "cancelled",
                      past: isPast && booking.status === "confirmed",
                    })}
                    onClick={() => onToggleCancel(booking.id, booking.status)}
                    disabled={deletingId === booking.id}
                  >
                    {deletingId === booking.id
                      ? "Restoring..."
                      : booking.status === "cancelled"
                        ? "Restore"
                        : "Cancel"}
                  </button>
                </div>
                <div className="client">
                  {booking.name || "Client"}
                  <div className="client-email">{booking.email}</div>
                  <div className="client-phone">{booking.phone}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
