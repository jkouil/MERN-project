import React, { useState } from 'react';
const backendPort = process.env.REACT_APP_BACKEND_PORT || 5000;
const backendURL = `http://localhost:${backendPort}`;

function RegisterForm({ onGoToLogin }) {
  const [formData, setFormData] = useState({
    pseudo: '',
    courriel: '',
    motdepasse: '',
    confirmation: '',
    isAdmin: false
  });
  const [message, setMessage] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12); // 默认12

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeneratePassword = async () => {
    try {
      const res = await fetch(`${backendURL}/motdepasse/${passwordLength}`);
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        motdepasse: data.motdepasse,
        confirmation: data.motdepasse
      }));
      setGeneratedPassword(`(${passwordLength} caractères) : ${data.motdepasse}`);
    } catch {
      setGeneratedPassword("Erreur lors de la génération du mot de passe.");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.motdepasse !== formData.confirmation) {
      setMessage(' Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await fetch(`${backendURL}/profils`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMessage(data.message || 'Utilisateur créé');
    } catch {
      setMessage('Erreur réseau.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* left login */}
      <div style={{ flex: 1 }}>
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <input name="pseudo" placeholder="Pseudo" onChange={handleChange} required /><br />
          <input name="courriel" placeholder="Email" onChange={handleChange} required /><br />
          <input name="motdepasse" placeholder="Mot de passe" value={formData.motdepasse} onChange={handleChange} required /><br />
          <input name="confirmation" placeholder="Confirmez le mot de passe" value={formData.confirmation} onChange={handleChange} required /><br />

          <label>
            <input type="checkbox" name="isAdmin" onChange={handleChange} />
            Administrateur
          </label><br />

          <button type="submit">Créer</button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={onGoToLogin}>Déjà inscrit ? Se connecter</button>
      </div>

      {/* mot de passe section */}
      <div style={{
        flex: 1,
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        
      }}>
        <h3>Générateur de mot de passe</h3>
        <label>Longueur : {passwordLength}</label><br />
        <input
          type="range"
          min="6"
          max="16"
          value={passwordLength}
          onChange={(e) => setPasswordLength(e.target.value)}
        /><br />
        <button type="button" onClick={handleGeneratePassword}>Générer</button>
        {generatedPassword && (
          <p style={{ color: 'blue', marginTop: '1rem' }}>
            Mot de passe généré {generatedPassword}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
