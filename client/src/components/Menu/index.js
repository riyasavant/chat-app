export default function Menu({handleThemeChange, theme, handleLogout}) {
    return (
        <div className="menu">
          <div className="darkMenu" onClick={handleThemeChange}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
          <div className="divider" style={{background: theme === 'dark' ? '#202124' : 'white'}}><hr /></div>
          <div className="logoutMenu" onClick={handleLogout}>Logout</div>
        </div>
    )
}