function CoursesPage() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h4 className="fw-bold text-primary">Academic Courses</h4>
        <p className="text-muted">Plan programmes, manage course offerings, and track credits.</p>
        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <div className="border rounded p-3">
              <h6 className="fw-bold">Programming I</h6>
              <p className="mb-0 text-muted">3 Credit Hours · Computer Science</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded p-3">
              <h6 className="fw-bold">Business Ethics</h6>
              <p className="mb-0 text-muted">2 Credit Hours · Business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
