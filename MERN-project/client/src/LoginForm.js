import React, { useState } from 'react';
const backendPort = process.env.REACT_APP_BACKEND_PORT || 5000;
const backendURL = `http://localhost:${backendPort}`;

function LoginForm({ onGoToRegister, onLoginSuccess }) {
  const [courriel, setCourriel] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courriel, motdepasse }),
      });
      const data = await res.json();

      if (res.ok) {
         setMessage('Connexion réussie !');
         
         onLoginSuccess({
                pseudo: data.pseudo,
                isAdmin: data.isAdmin,
                id: data.id,
                courriel: data.courriel,
                token: data.token 
            });
}

       else {
        setMessage(data.message || 'Échec de connexion');
      }
    } catch {
      setMessage('Erreur réseau.');
    }
  };

  return (
    <div>
      <h2>Se connecter</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={courriel}
          onChange={(e) => setCourriel(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
          required
        /><br />
        <button type="submit">Connexion</button>
      </form>
      {message && <p>{message}</p>}
      <p>Pas encore inscrit ? <button onClick={onGoToRegister}>Créer un compte</button></p>
    </div>
  );
}

export default LoginForm;
