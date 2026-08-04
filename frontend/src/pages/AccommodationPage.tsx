function AccommodationPage() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="fw-bold text-primary">Accommodation Management</h4>
        <p className="text-muted">Assign rooms, manage hostels, and monitor occupancy.</p>
        <ul className="list-group mt-3">
          <li className="list-group-item">Hostel A · 92% occupied</li>
          <li className="list-group-item">Hostel B · 74% occupied</li>
        </ul>
      </div>
    </div>
  );
}

export default AccommodationPage;
