import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const navItems = [
  { to: '/', label: 'Home', icon: 'fas fa-home' },
  { to: '/registration', label: 'Registration', icon: 'fas fa-edit', submenu: [
    { to: '/registration/basic', label: 'Basic Details' },
    { to: '/registration/admission', label: 'Admission Details' },
    { to: '/registration/schools', label: 'Attended Schools' },
    { to: '/registration/college', label: 'Attended College(s)' },
    { to: '/registration/health', label: 'Health Insurance' },
    { to: '/registration/experience', label: 'Work Experience(s)' },
    { to: '/registration/contact', label: 'Contact(s)' },
    { to: '/registration/sponsor', label: 'Study Sponsor(s)' },
    { to: '/registration/courses', label: 'Enrolled Courses' },
    { to: '/registration/form', label: 'Registration Form' }
  ]},
  { to: '/nhif', label: 'NHIF Portal', icon: 'fas fa-hospital', submenu: [
    { to: '/nhif/membership', label: 'Membership Registration' },
    { to: '/nhif/card-application', label: 'Card Application' },
    { to: '/nhif/invoices', label: 'Application Invoices' },
    { to: '/nhif/verification', label: 'Card Verification' }
  ]},
  { to: '/student-services', label: 'Student Services', icon: 'fas fa-graduation-cap' },
  { to: '/academic', label: 'Academic', icon: 'fas fa-book' },
  { to: '/account', label: 'My Account', icon: 'fas fa-cog' }
];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className="amis-container">
      {/* Header */}
      <header className="amis-header">
        <div className="header-top">
          <div className="logo-section">
            <img src="https://via.placeholder.com/50" alt="University Logo" className="university-logo" />
            <div className="university-info">
              <h1>ARDHI UNIVERSITY</h1>
              <p>Academic Management Information System</p>
            </div>
          </div>
          <div className="user-profile">
            <img src="https://via.placeholder.com/40" alt="User" className="profile-avatar" />
            <span className="user-name">SULEIMANI MAULID MADENI</span>
          </div>
        </div>
        <div className="header-nav">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <div className="amis-main">
        {/* Sidebar */}
        <aside className={`amis-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <div key={item.label} className="nav-item-wrapper">
                <div className="nav-item-container">
                  <NavLink 
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => item.submenu && toggleSubmenu(item.label)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                    {item.submenu && <i className={`fas fa-chevron-${expandedMenu === item.label ? 'down' : 'right'} submenu-arrow`}></i>}
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

        {/* Main Content */}
        <main className="amis-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
