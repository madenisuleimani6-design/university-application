import '../styles/registration.css';

function RegistrationPage() {
  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>Student Registration</h1>
        <p>Complete your registration by filling out all required sections</p>
      </div>

      <div className="registration-steps">
        <div className="step-item completed">
          <div className="step-number">1</div>
          <div className="step-title">Basic Details</div>
          <i className="fas fa-check"></i>
        </div>
        <div className="step-connector"></div>
        <div className="step-item completed">
          <div className="step-number">2</div>
          <div className="step-title">Admission Details</div>
          <i className="fas fa-check"></i>
        </div>
        <div className="step-connector"></div>
        <div className="step-item active">
          <div className="step-number">3</div>
          <div className="step-title">Attended Schools</div>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <div className="step-number">4</div>
          <div className="step-title">Attended College(s)</div>
        </div>
      </div>

      <div className="registration-content">
        <div className="registration-card">
          <h2 className="section-title">ATTENDED SCHOOLS</h2>
          <form className="registration-form">
            <div className="form-section">
              <div className="form-group">
                <label>School Name</label>
                <input type="text" className="form-control" placeholder="Enter school name" />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input type="text" className="form-control" placeholder="Enter location" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Year</label>
                  <input type="number" className="form-control" placeholder="2010" />
                </div>
                <div className="form-group">
                  <label>End Year</label>
                  <input type="number" className="form-control" placeholder="2016" />
                </div>
              </div>

              <div className="form-group">
                <label>Certificate/Award Obtained</label>
                <input type="text" className="form-control" placeholder="e.g., KCSE Certificate" />
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea className="form-control" placeholder="Additional remarks" rows={3}></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Continue <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="registration-sidebar">
          <div className="progress-card">
            <h3>Registration Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
            <p className="progress-text">3 of 10 sections completed</p>
          </div>

          <div className="help-card">
            <h3>Need Help?</h3>
            <p>Contact the Student Services office for assistance with your registration.</p>
            <button className="btn btn-outline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
