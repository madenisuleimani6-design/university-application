import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

const navItems = [
  { to: '/', label: 'Home', icon: 'fas fa-home' },
  {
    to: '/registration/basic',
    label: 'Registration',
    icon: 'fas fa-edit',
    submenu: [
      { to: '/registration/basic', label: 'Basic Details' },
      { to: '/registration/admission', label: 'Admission Details' },
      { to: '/registration/schools', label: 'Attended Schools' },
      { to: '/registration/college', label: 'Attended College(s)' },
      { to: '/registration/health', label: 'Health Insurance' },
      { to: '/registration/experience', label: 'Work Experience(s)' },
      { to: '/registration/contact', label: 'Contact(s)' },
      { to: '/registration/sponsor', label: 'Study Sponsor(s)' },
      { to: '/registration/courses', label: 'Enrolled Courses' },
      { to: '/registration/form', label: 'Registration Form' },
    ],
  },
  {
    to: '/nhif/membership',
    label: 'NHIF Portal',
    icon: 'fas fa-hospital',
    submenu: [
      { to: '/nhif/membership', label: 'Membership Registration' },
      { to: '/nhif/card-application', label: 'Card Application' },
      { to: '/nhif/invoices', label: 'Application Invoices' },
      { to: '/nhif/verification', label: 'Card Verification' },
    ],
  },
  {
    to: '/student-services/financial-services',
    label: 'Student Services',
    icon: 'fas fa-list',
    submenu: [
      { to: '/student-services/financial-services', label: 'Financial Services' },
      { to: '/student-services/id-services', label: 'ID Services' },
      { to: '/student-services/accommodation', label: 'Accommodation' },
      { to: '/student-services/change-status', label: 'Change Status' },
      { to: '/student-services/clearance', label: 'Clearance' },
      { to: '/student-services/results-appeal', label: 'Result(s) Appeal' },
      { to: '/student-services/academic-documents', label: 'Academic Documents' },
    ],
  },
  {
    to: '/academic/results',
    label: 'Academic',
    icon: 'fas fa-graduation-cap',
    submenu: [{ to: '/academic/results', label: 'My Results' }],
  },
  {
    to: '/account/change-password',
    label: 'My Account',
    icon: 'fas fa-wrench',
    submenu: [
      { to: '/account/change-password', label: 'Change Password' },
      { to: '/account/change-profile', label: 'Change Profile' },
    ],
  },
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const active = navItems.find(
      (item) =>
        item.submenu &&
        (location.pathname.startsWith(item.to.split('/').slice(0, 2).join('/')) ||
          item.submenu.some((sub) => location.pathname.startsWith(sub.to)))
    );
    if (active) {
      setExpandedMenu(active.label);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <div className="amis-container">
      <header className="amis-header">
        <div className="header-top">
          <div className="logo-section">
            <img
              src="/images/ardhi-logo.png"
              alt="Ardhi University - Academic Management Information System"
              className="university-banner"
            />
          </div>

          <div className="user-profile-wrapper" ref={profileRef}>
            <button
              type="button"
              className="user-profile"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="profile-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span className="user-name">SULEIMANI MAULID MADENI</span>
              <i className={`fas fa-chevron-down profile-chevron ${profileOpen ? 'open' : ''}`}></i>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <NavLink
                  to="/account/change-password"
                  className="profile-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Change Password
                </NavLink>
                <NavLink
                  to="/account/change-profile"
                  className="profile-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Change Profile
                </NavLink>
                <button type="button" className="profile-dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="header-nav">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <div className="amis-main">
        <aside className={`amis-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <div key={item.label} className="nav-item-wrapper">
                <div className="nav-item-container">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item ${isActive || (item.submenu?.some((s) => location.pathname.startsWith(s.to)) ?? false) ? 'active' : ''}`
                    }
                    onClick={() => item.submenu && toggleSubmenu(item.label)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                    {item.submenu && (
                      <i className={`fas fa-chevron-${expandedMenu === item.label ? 'down' : 'right'} submenu-arrow`}></i>
                    )}
                  </NavLink>
                </div>
                {item.submenu && expandedMenu === item.label && (
                  <div className="submenu">
                    {item.submenu.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main className="amis-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
