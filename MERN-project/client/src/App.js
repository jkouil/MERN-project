import React, { useState } from 'react';
import RegisterForm from './Register';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard'; 
import './App.css';

function App() {
  const [page, setPage] = useState('register');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setPage('login');
  };

  return (
    


    <div className="App">
      
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <a
          href="/API_description.html"
          target="_blank"
          rel="noopener noreferrer"
          className="api-link"
        >
          Voir la documentation API
        </a>
      </div>

      
      <header className="App-header">
        <h1 className="header-title">🐾 Gestion de Profils 🐾</h1>
      <div className="card">
      {page === 'register' && (
        <RegisterForm onGoToLogin={() => setPage('login')} />
      )}
      {page === 'login' && (
        <LoginForm
          onGoToRegister={() => setPage('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard userInfo={loggedInUser} onLogout={handleLogout} />
      )}
      </div>
      </header>
    </div>
  );
}

export default App;
