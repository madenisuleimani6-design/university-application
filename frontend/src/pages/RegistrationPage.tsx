import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/registration.css';

const STEPS = [
  { path: 'basic', title: 'Basic Details', section: 'BASIC DETAILS' },
  { path: 'admission', title: 'Admission Details', section: 'ADMISSION DETAILS' },
  { path: 'schools', title: 'Attended Schools', section: 'ATTENDED SCHOOLS' },
  { path: 'college', title: 'Attended College(s)', section: 'ATTENDED COLLEGE(S)' },
  { path: 'health', title: 'Health Insurance', section: 'HEALTH INSURANCE' },
  { path: 'experience', title: 'Work Experience(s)', section: 'WORK EXPERIENCE(S)' },
  { path: 'contact', title: 'Contact(s)', section: 'CONTACT(S)' },
  { path: 'sponsor', title: 'Study Sponsor(s)', section: 'STUDY SPONSOR(S)' },
  { path: 'courses', title: 'Enrolled Courses', section: 'ENROLLED COURSES' },
  { path: 'form', title: 'Registration Form', section: 'REGISTRATION FORM' },
];

const STORAGE_KEY = 'amis_registration_data';

type FormData = Record<string, string>;

function getStepIndex(path: string): number {
  const idx = STEPS.findIndex((s) => s.path === path);
  return idx >= 0 ? idx : 0;
}

function RegistrationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'basic';
  const currentIndex = getStepIndex(segment);
  const currentStep = STEPS[currentIndex];

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentIndex < STEPS.length - 1) {
      navigate(`/registration/${STEPS[currentIndex + 1].path}`);
    } else {
      alert('Registration submitted successfully!');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/registration/${STEPS[currentIndex - 1].path}`);
    }
  };

  const progress = Math.round(((currentIndex + 1) / STEPS.length) * 100);

  const renderFields = () => {
    switch (currentStep.path) {
      case 'basic':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" value={formData.firstName || ''} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Enter first name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" value={formData.lastName || ''} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Enter last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" className="form-control" value={formData.dob || ''} onChange={(e) => updateField('dob', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-control" value={formData.gender || ''} onChange={(e) => updateField('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input type="text" className="form-control" value={formData.nationality || ''} onChange={(e) => updateField('nationality', e.target.value)} placeholder="Enter nationality" />
            </div>
          </>
        );
      case 'admission':
        return (
          <>
            <div className="form-group">
              <label>Admission Number</label>
              <input type="text" className="form-control" value={formData.admissionNo || '32615/T.2024'} onChange={(e) => updateField('admissionNo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Programme</label>
              <input type="text" className="form-control" value={formData.programme || 'Bachelor of Science in Information Systems Management'} onChange={(e) => updateField('programme', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Academic Year</label>
                <input type="text" className="form-control" value={formData.academicYear || '2025/26'} onChange={(e) => updateField('academicYear', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Year of Study</label>
                <select className="form-control" value={formData.yearOfStudy || ''} onChange={(e) => updateField('yearOfStudy', e.target.value)}>
                  <option value="">Select year</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'schools':
        return (
          <>
            <div className="form-group">
              <label>School Name</label>
              <input type="text" className="form-control" value={formData.schoolName || ''} onChange={(e) => updateField('schoolName', e.target.value)} placeholder="Enter school name" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-control" value={formData.schoolLocation || ''} onChange={(e) => updateField('schoolLocation', e.target.value)} placeholder="Enter location" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Year</label>
                <input type="number" className="form-control" value={formData.schoolStart || ''} onChange={(e) => updateField('schoolStart', e.target.value)} placeholder="2010" />
              </div>
              <div className="form-group">
                <label>End Year</label>
                <input type="number" className="form-control" value={formData.schoolEnd || ''} onChange={(e) => updateField('schoolEnd', e.target.value)} placeholder="2016" />
              </div>
            </div>
            <div className="form-group">
              <label>Certificate/Award Obtained</label>
              <input type="text" className="form-control" value={formData.schoolCertificate || ''} onChange={(e) => updateField('schoolCertificate', e.target.value)} placeholder="e.g., CSEE Certificate" />
            </div>
          </>
        );
      case 'college':
        return (
          <>
            <div className="form-group">
              <label>College/Institution Name</label>
              <input type="text" className="form-control" value={formData.collegeName || ''} onChange={(e) => updateField('collegeName', e.target.value)} placeholder="Enter college name" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Year</label>
                <input type="number" className="form-control" value={formData.collegeStart || ''} onChange={(e) => updateField('collegeStart', e.target.value)} />
              </div>
              <div className="form-group">
                <label>End Year</label>
                <input type="number" className="form-control" value={formData.collegeEnd || ''} onChange={(e) => updateField('collegeEnd', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Qualification Obtained</label>
              <input type="text" className="form-control" value={formData.collegeQualification || ''} onChange={(e) => updateField('collegeQualification', e.target.value)} />
            </div>
          </>
        );
      case 'health':
        return (
          <>
            <div className="form-group">
              <label>NHIF Membership Number</label>
              <input type="text" className="form-control" value={formData.nhifNo || ''} onChange={(e) => updateField('nhifNo', e.target.value)} placeholder="Enter NHIF number" />
            </div>
            <div className="form-group">
              <label>Health Insurance Provider</label>
              <select className="form-control" value={formData.insuranceProvider || 'NHIF'} onChange={(e) => updateField('insuranceProvider', e.target.value)}>
                <option value="NHIF">NHIF</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <textarea className="form-control" value={formData.healthRemarks || ''} onChange={(e) => updateField('healthRemarks', e.target.value)} rows={3} placeholder="Additional health information" />
            </div>
          </>
        );
      case 'experience':
        return (
          <>
            <div className="form-group">
              <label>Employer/Organization</label>
              <input type="text" className="form-control" value={formData.employer || ''} onChange={(e) => updateField('employer', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Position/Role</label>
              <input type="text" className="form-control" value={formData.position || ''} onChange={(e) => updateField('position', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" className="form-control" value={formData.expStart || ''} onChange={(e) => updateField('expStart', e.target.value)} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" className="form-control" value={formData.expEnd || ''} onChange={(e) => updateField('expEnd', e.target.value)} />
              </div>
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-control" value={formData.phone || '0789079611'} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} placeholder="student@ardhi.ac.tz" />
            </div>
            <div className="form-group">
              <label>Physical Address</label>
              <textarea className="form-control" value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} rows={3} placeholder="Enter physical address" />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input type="text" className="form-control" value={formData.emergencyContact || ''} onChange={(e) => updateField('emergencyContact', e.target.value)} />
            </div>
          </>
        );
      case 'sponsor':
        return (
          <>
            <div className="form-group">
              <label>Sponsor Name</label>
              <input type="text" className="form-control" value={formData.sponsorName || ''} onChange={(e) => updateField('sponsorName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Sponsor Type</label>
              <select className="form-control" value={formData.sponsorType || ''} onChange={(e) => updateField('sponsorType', e.target.value)}>
                <option value="">Select type</option>
                <option value="Self">Self</option>
                <option value="Parent/Guardian">Parent/Guardian</option>
                <option value="Government">Government (HESLB/Loan)</option>
                <option value="Employer">Employer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sponsor Contact</label>
              <input type="text" className="form-control" value={formData.sponsorContact || ''} onChange={(e) => updateField('sponsorContact', e.target.value)} />
            </div>
          </>
        );
      case 'courses':
        return (
          <>
            <div className="alert alert-info mb-3">
              <i className="fas fa-info-circle"></i> Select courses for the current semester (2025/26 Semester I)
            </div>
            <div className="form-group">
              <label>Course 1</label>
              <select className="form-control" value={formData.course1 || ''} onChange={(e) => updateField('course1', e.target.value)}>
                <option value="">Select course</option>
                <option value="ISM 2101">ISM 2101 - Database Systems</option>
                <option value="ISM 2102">ISM 2102 - Software Engineering</option>
                <option value="ISM 2103">ISM 2103 - Computer Networks</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course 2</label>
              <select className="form-control" value={formData.course2 || ''} onChange={(e) => updateField('course2', e.target.value)}>
                <option value="">Select course</option>
                <option value="ISM 2101">ISM 2101 - Database Systems</option>
                <option value="ISM 2102">ISM 2102 - Software Engineering</option>
                <option value="ISM 2103">ISM 2103 - Computer Networks</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course 3</label>
              <select className="form-control" value={formData.course3 || ''} onChange={(e) => updateField('course3', e.target.value)}>
                <option value="">Select course</option>
                <option value="ISM 2101">ISM 2101 - Database Systems</option>
                <option value="ISM 2102">ISM 2102 - Software Engineering</option>
                <option value="ISM 2103">ISM 2103 - Computer Networks</option>
              </select>
            </div>
          </>
        );
      case 'form':
        return (
          <div className="registration-summary">
            <p className="mb-3">Review your registration details before submitting:</p>
            <table className="table table-bordered table-sm">
              <tbody>
                {Object.entries(formData).map(([key, value]) => (
                  <tr key={key}>
                    <td className="fw-semibold text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                    <td>{value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(formData).length === 0 && (
              <p className="text-muted">No data entered yet. Go back to previous steps to fill in your details.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>Student Registration</h1>
        <p>Complete your registration by filling out all required sections</p>
      </div>

      <div className="registration-steps">
        {STEPS.map((step, idx) => (
          <div key={step.path} style={{ display: 'contents' }}>
            {idx > 0 && <div className="step-connector"></div>}
            <div
              className={`step-item ${idx < currentIndex ? 'completed' : ''} ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => navigate(`/registration/${step.path}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-number">{idx + 1}</div>
              <div className="step-title">{step.title}</div>
              {idx < currentIndex && <i className="fas fa-check"></i>}
            </div>
          </div>
        ))}
      </div>

      <div className="registration-content">
        <div className="registration-card">
          <h2 className="section-title">{currentStep.section}</h2>
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-section">{renderFields()}</div>
            <div className="form-actions">
              {currentIndex > 0 && (
                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {currentIndex < STEPS.length - 1 ? (
                  <>Save & Continue <i className="fas fa-arrow-right"></i></>
                ) : (
                  <>Submit Registration <i className="fas fa-check"></i></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="registration-sidebar">
          <div className="progress-card">
            <h3>Registration Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{currentIndex + 1} of {STEPS.length} sections completed</p>
          </div>
          <div className="help-card">
            <h3>Need Help?</h3>
            <p>Contact the Student Services office for assistance with your registration.</p>
            <button type="button" className="btn btn-outline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
