export default function ServiceList({ services, onSelect }) {
  return (
    <div className="service-list">
      <h2>Available Services</h2>
      {services.map((service) => (
        <div
          key={service.id}
          className="service-item"
          onClick={() => onSelect(service)}
        >
          <span>
            <h3>{service.name}</h3>
            <i>{service.duration} minutes</i>
          </span>
          <h4>{service.price} USD</h4>
          <button onClick={() => onSelect(service)}>Book</button>
        </div>
      ))}
    </div>
  );
}
