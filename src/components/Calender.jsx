export default function Calender({ selectedDate, setSelectedDate }) {
  return (
    <div className="calender">
      <h2>Select a Date</h2>
      <input
        type="date"
        onChange={(e) => setSelectedDate(e.target.value)}
        value={selectedDate}
        min={new Date().toISOString().split("T")[0]}
        className="date-picker"
      />
      {selectedDate && (
        <>
          <i>Selected Date: {selectedDate}</i>
        </>
      )}
    </div>
  );
}
