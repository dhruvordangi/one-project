import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Sidebar() {
  const { userInfo } = useContext(UserContext);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <>
      <aside className="sidebar">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/completed-task">Completed Tasks</Link></li>
          <li><Link to={`/login/profile/${userInfo.id}`}>Profile</Link></li>
          
          {/* To-Do Menu with Sub-Items */}
          <li onClick={toggleSubMenu} style={{ cursor: 'pointer' }}>
            To-Do
          </li>
          {showSubMenu && (
            <ul className="submenu">
              <li><Link to="/assignments">Assignments</Link></li>
              <li><Link to="/all-projects">Projects</Link></li>
            </ul>
          )}
        </ul>
      </aside>

    </>
  );
}

export default Sidebar;
