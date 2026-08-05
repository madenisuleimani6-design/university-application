import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../styles/portal.css';

function ChangeProfilePage() {
  const [profile, setProfile] = useState({
    firstName: 'SULEIMANI',
    middleName: 'MAULID',
    lastName: 'MADENI',
    email: 's.madeni@students.ardhi.ac.tz',
    phone: '0789079611',
    admissionNo: '32615/T.2024',
    programme: 'Bachelor of Science in Information Systems Management',
  });
  const [message, setMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('amis_profile', JSON.stringify(profile));
    setMessage('Profile updated successfully.');
  };

  return (
    <div className="portal-container">
      <nav className="portal-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep"> / </span>
        <Link to="/account/change-profile">My Account</Link>
        <span className="breadcrumb-sep"> / </span>
        <span className="breadcrumb-current">Change Profile</span>
      </nav>

      <div className="portal-card" style={{ maxWidth: 640 }}>
        <h2 className="portal-title">Change Profile</h2>

        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Middle Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.middleName}
                onChange={(e) => updateField('middleName', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={profile.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={profile.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Admission Number</label>
            <input type="text" className="form-control" value={profile.admissionNo} readOnly />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Programme</label>
            <input type="text" className="form-control" value={profile.programme} readOnly />
          </div>
          <button type="submit" className="portal-btn portal-btn-search">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangeProfilePage;
