import { useEffect, useState } from 'react';
import { getCourses, getStudents, getAnnouncements, Announcement } from '../services/api';
import '../styles/dashboard.css';

function DashboardPage() {
  const [courseCount, setCourseCount] = useState(0);
  const [updates, setUpdates] = useState<Announcement[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [, courses, announcements] = await Promise.all([getStudents(), getCourses(), getAnnouncements()]);
        // Django paginates list endpoints ({count, results}); the Java backend returns plain arrays.
        const courseList = Array.isArray(courses) ? courses : (courses?.results ?? []);
        setCourseCount(courseList.length);
        setUpdates((Array.isArray(announcements) ? announcements : []).slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="alert alert-info mb-4">
        <i className="fas fa-hand-paper"></i>
        <strong>Welcome To AMIS (Ardhi University)</strong>
        <span className="welcome-year">The current academic year is 2025/26</span>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-header">CURRENTLY ENROLLED COURSES</div>
          <div className="stat-value">{courseCount}</div>
          <div className="stat-icon"><i className="fas fa-graduation-cap"></i></div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-header">TOTAL CURRENT CREDITS</div>
          <div className="stat-value">{courseCount * 10}</div>
          <div className="stat-icon"><i className="fas fa-book"></i></div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-header">TOTAL PASSED</div>
          <div className="stat-value">{Math.floor(courseCount * 0.8)}</div>
          <div className="stat-icon"><i className="fas fa-smile"></i></div>
        </div>

        <div className="stat-card stat-card-red">
          <div className="stat-header">TOTAL FAILED</div>
          <div className="stat-value">{Math.floor(courseCount * 0.2)}</div>
          <div className="stat-icon"><i className="fas fa-frown"></i></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Profile Summary */}
        <div className="dashboard-card profile-card">
          <h3 className="card-title">PROFILE SUMMARY</h3>
          <div className="profile-content">
            <div className="profile-avatar-large">
              <i className="fas fa-user"></i>
            </div>
            <div className="profile-info">
              <h4>SULEIMANI MAULID MADENI</h4>
              <p className="profile-role">STUDENT</p>
              <p className="profile-programme">Bachelor of Science in Information Systems Management</p>
            </div>
          </div>
        </div>

        {/* Registration Verification */}
        <div className="dashboard-card verification-card">
          <h3 className="card-title">REGISTRATION VERIFICATION</h3>
          <div className="verification-timeline">
            <div className="timeline-step completed">
              <div className="timeline-dot"></div>
              <div className="timeline-label">
                <p className="timeline-title">BURSAR VERIFICATION (UNDERGRADUATE)</p>
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="timeline-connector"></div>
            <div className="timeline-step completed">
              <div className="timeline-dot"></div>
              <div className="timeline-label">
                <p className="timeline-title">HEAD OF DEPARTMENT VERIFICATION (UNDERGRADUATE)</p>
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="timeline-connector"></div>
            <div className="timeline-step completed">
              <div className="timeline-dot"></div>
              <div className="timeline-label">
                <p className="timeline-title">DIRECTOR OF UNDERGRADUATE PROGRAMS VERIFICATION</p>
                <i className="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="dashboard-card">
        <h3 className="card-title">RECENT UPDATES</h3>
        <div className="updates-list">
          {updates.length === 0 && <div className="update-item"><span className="update-text">No new updates from the university right now.</span></div>}
          {updates.map((item) => (
            <a className="update-item" key={item.id} href="/information">
              <span className="update-date">{item.publishAt ? new Date(item.publishAt).toISOString().slice(0, 10) : 'Today'}</span>
              <span className="update-text">{item.title}{item.priority !== 'NORMAL' ? ` — ${item.priority}` : ''}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;