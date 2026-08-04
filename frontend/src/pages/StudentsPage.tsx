function StudentsPage() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="fw-bold text-primary">Student Management</h4>
        <p className="text-muted">Manage student profiles, results, registrations, and transcripts.</p>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Programme</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ST-001</td>
              <td>Alice Kimani</td>
              <td>Computer Science</td>
              <td><span className="badge bg-success">Active</span></td>
            </tr>
            <tr>
              <td>ST-002</td>
              <td>Brian Otieno</td>
              <td>Business Administration</td>
              <td><span className="badge bg-warning text-dark">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsPage;
