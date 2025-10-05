import React, { useState } from 'react';
const backendPort = process.env.REACT_APP_BACKEND_PORT || 5000;
const backendURL = `http://localhost:${backendPort}`;


function Dashboard({ userInfo, onLogout }) {
  const [pseudoInput, setPseudoInput] = useState('');
  const [idLookupResult, setIdLookupResult] = useState(null);
  const [idInput, setIdInput] = useState('');
  const [userById, setUserById] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');

  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  //that part is for put requests
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newPseudo, setNewPseudo] = useState(userInfo.pseudo);
  const [newCourriel, setNewCourriel] = useState(userInfo.courriel);
  const [confirmationData, setConfirmationData] = useState(null);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const [showAdminEditModal, setShowAdminEditModal] = useState(false);

  
  const [adminEditId, setAdminEditId] = useState('');
  const [adminEditData, setAdminEditData] = useState(null); // fetched user data
  const [adminNewPseudo, setAdminNewPseudo] = useState('');
  const [adminNewCourriel, setAdminNewCourriel] = useState('');
  const [showAdminConfirmModal, setShowAdminConfirmModal] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState('');

  //that is for delete requests
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserInfo, setDeleteUserInfo] = useState(null);


 
  
   const handleModifyClick = () => {
    setShowEditModal(true);
  };

  
  const handleEditNext = () => {
    setConfirmationData({
      oldPseudo: userInfo.pseudo,
      oldCourriel: userInfo.courriel,
      newPseudo,
      newCourriel,
      newPassword
    });
    setShowEditModal(false);
    setShowConfirmModal(true);
  };

  

  const handleConfirmEdit = async () => {
  try {
    const updatedFields = {
       pseudo: confirmationData.newPseudo,
      courriel: confirmationData.newCourriel,
      };

   if (confirmationData.newPassword && confirmationData.newPassword.trim() !== '') {
  updatedFields.motdepasse = confirmationData.newPassword;
}

    const res = await fetch(`${backendURL}/profils/${userInfo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         'token': userInfo.token  
      },
      body: JSON.stringify(updatedFields)
    });

    const data = await res.json(); 

    if (!res.ok) {
      if (res.status === 400) {
        setErrorModalMessage(data.message || "Erreur inconnue");
        setErrorModalVisible(true);
        return;
      } else {
        throw new Error(data.message || 'Erreur inconnue lors modification');
      }
    }

    setMessage('Modification réussie !');
    setShowConfirmModal(false);
  } catch (err) {
    setMessage(err.message);
  }
};

  const handleLookupSelf = async () => {
  try {
    const res = await fetch(`${backendURL}/profils/${userInfo.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token
      }
    });
    if (!res.ok) throw new Error("Utilisateur introuvable");
    const data = await res.json();
    setUserById(data);
    setError('');
  } catch (err) {
    setError(err.message);
    setUserById(null);
  }
};

  const handleLookupId = async () => {
    try {
      const res = await fetch(`${backendURL}/profils/pseudo/${pseudoInput}`);
      if (!res.ok) throw new Error("Utilisateur non trouvé");
      const data = await res.json();
      setIdLookupResult(data.id);
      setError('');
    } catch (err) {
      setError(err.message);
      setIdLookupResult(null);
    }
  };

  const handleLookupUserById = async () => {
    try {

      
      const res = await fetch(`${backendURL}/profils/${idInput}`, {
        headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token  
      }
});
      if (!res.ok) throw new Error("Utilisateur introuvable");
      const data = await res.json();
      setUserById(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setUserById(null);
    }
  };

  const handleGetAllUsers = async () => {
    if (!userInfo.isAdmin) {
      setError("Accès refusé : administrateur requis");
      setAllUsers([]);
      return;
    }
    try {
      const res = await fetch(`${backendURL}/profils`, {
      headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token  
      }
    });
      const data = await res.json();
      setAllUsers(data);
      setError('');
    } catch (err) {
      setError("Erreur lors de la récupération des utilisateurs");
      setAllUsers([]);
    }
  };

   const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left'
};

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    padding: '2rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    zIndex: 1000,
    borderRadius: '8px'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999
  };

  console.log(userInfo);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onLogout}>Déconnexion</button>
        <button onClick={handleModifyClick}>Modifier mes informations</button>

      </div>

      <h2>Bienvenue, {userInfo.pseudo}</h2>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => setShowModal1(true)}> Chercher ID par pseudo</button>
        <button onClick={() => setShowModal2(true)} style={{ marginLeft: '1rem' }}>
           Voir infos utilisateur par ID
        </button>
        <button onClick={async () => {
          await handleGetAllUsers();
          setShowModal3(true);
        }} style={{ marginLeft: '1rem' }}>
           Voir tous les utilisateurs
        </button>
        <button
  onClick={() => setShowAdminEditModal(true)}
  style={{ marginLeft: '1rem' }}
>
   Modifier un utilisateur par ID
</button>


  <button onClick={() => setShowDeleteModal(true)} style={{ marginLeft: '1rem' }}>
     Supprimer un utilisateur
  </button>


      </div>

      {/* Modal: Edit Info */}
      {showEditModal && (
        <>
          <div style={overlayStyle} onClick={() => setShowEditModal(false)} />
          <div style={modalStyle}>
            <h3>Modifier mes informations</h3>
            <label>Pseudo:</label>
            <input value={newPseudo} onChange={(e) => setNewPseudo(e.target.value)} />
            <br />
            <label>Courriel:</label>
            <input value={newCourriel} onChange={(e) => setNewCourriel(e.target.value)} />
            <br />
            <label>Mot de passe (laissez vide pour ne pas changer) :</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            
            <br />
            <button onClick={handleEditNext}>Suivant</button>
            <button onClick={() => setShowEditModal(false)}>Annuler</button>
          </div>
        </>
      )}

      {showConfirmModal && (
  <>
    <div style={overlayStyle} onClick={() => setShowConfirmModal(false)} />
    <div style={modalStyle}>
      <h3>Confirmer les modifications</h3>
      <p><strong>Pseudo actuel :</strong> {confirmationData.oldPseudo}</p>
      <p><strong>Nouveau pseudo :</strong> {confirmationData.newPseudo}</p>
      <p><strong>Email actuel :</strong> {confirmationData.oldCourriel}</p>
      <p><strong>Nouveau email :</strong> {confirmationData.newCourriel}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleConfirmEdit} style={{ marginRight: '1rem' }}>Confirmer</button>
        <button onClick={() => setShowConfirmModal(false)}>Annuler</button>
      </div>
    </div>
  </>
)}

      
      

      {/* Modal : Rechercher ID par pseudo */}
      {showModal1 && (
        <>
          <div style={overlayStyle} onClick={() => setShowModal1(false)} />
          <div style={modalStyle}>
            <h3>Chercher l’ID d’un utilisateur</h3>
            <input
              type="text"
              placeholder="Entrez le pseudo"
              value={pseudoInput}
              onChange={e => setPseudoInput(e.target.value)}
            />
            <button onClick={handleLookupId} style={{ marginLeft: '1rem' }}>Rechercher</button>
            {idLookupResult && <p>ID : <strong>{idLookupResult}</strong></p>}
            <button onClick={() => setShowModal1(false)}>Fermer</button>
          </div>
        </>
      )}

      {/* Modal : Infos par ID */}
      {showModal2 && (
  <>
    <div style={overlayStyle} onClick={() => setShowModal2(false)} />
    <div style={modalStyle}>
      <h3>Voir les infos d’un utilisateur</h3>

      {userInfo.isAdmin ? (
        
        <>
          <input
            type="text"
            placeholder="Entrez l'ID"
            value={idInput}
            onChange={e => setIdInput(e.target.value)}
          />
          <button onClick={handleLookupUserById} style={{ marginLeft: '1rem' }}>
            Voir
          </button>
        </>
      ) : (
        
        <>
          <p style={{ color: '#555', marginBottom: '0.5rem' }}>
            Les utilisateurs non-admin ne peuvent consulter que leur propre profil.
          </p>
          <button onClick={handleLookupSelf}>Voir mon profil</button>
        </>
      )}

      {userById && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Pseudo:</strong> {userById.pseudo}</p>
          <p><strong>Email:</strong> {userById.courriel}</p>
          <p><strong>Type:</strong> {userById.isAdmin ? 'Admin' : 'User'}</p>
        </div>
      )}

      <button onClick={() => setShowModal2(false)} style={{ marginTop: '1rem' }}>Fermer</button>
    </div>
  </>
)}


      {/* Modal: Tous les utilisateurs */}
      {showModal3 && (
        <>
  <div style={overlayStyle} onClick={() => setShowModal3(false)} />
  <div style={modalStyle}>
    <h3>Liste de tous les utilisateurs</h3>
    {userInfo.isAdmin ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Pseudo</th>
            <th style={cellStyle}>Courriel</th>
            <th style={cellStyle}>Type</th>
            <th style={cellStyle}>ID</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(user => (
            <tr key={user._id}>
              <td style={cellStyle}>{user.pseudo}</td>
              <td style={cellStyle}>{user.courriel}</td>
              <td style={cellStyle}>{user.isAdmin ? 'Admin' : 'User'}</td>
              <td style={cellStyle}>{user._id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={{ color: 'red' }}>Accès refusé : administrateur requis</p>
    )}
    <button onClick={() => setShowModal3(false)} style={{ marginTop: '1rem' }}>Fermer</button>
  </div>
</>

    

      )}


      {showAdminEditModal && (
  <>
    <div style={overlayStyle} onClick={() => setShowAdminEditModal(false)} />
    <div style={modalStyle}>
      {userInfo.isAdmin ? (
        <>
          <h3>Modifier un utilisateur (Admin)</h3>
          <label>ID de l'utilisateur :</label>
          <input
            value={adminEditId}
            onChange={(e) => setAdminEditId(e.target.value)}
          />
          <button
            onClick={async () => {
              try {
                
                const res = await fetch(`${backendURL}/profils/${adminEditId}`, {
        headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token  
      }
});
                if (!res.ok) throw new Error('Utilisateur introuvable');
                const data = await res.json();
                setAdminEditData(data);
                setAdminNewPseudo(data.pseudo);
                setAdminNewCourriel(data.courriel);
                setAdminNewPassword('');
                
              } catch (err) {
                alert(err.message);
              }
            }}
            style={{ marginLeft: '1rem' }}
          >
            Charger
          </button>

          {adminEditData && (
  <div style={{ marginTop: '1rem' }}>
    <label>Nouveau pseudo:</label>
    <input
      value={adminNewPseudo}
      onChange={(e) => setAdminNewPseudo(e.target.value)}
    /><br />
    
    <label>Nouveau courriel:</label>
    <input
      value={adminNewCourriel}
      onChange={(e) => setAdminNewCourriel(e.target.value)}
    /><br />

    <label>Nouveau mot de passe:</label>
    <input
      type="password"
      value={adminNewPassword}
      onChange={(e) => setAdminNewPassword(e.target.value)}
    /><br /><br />

    <button onClick={() => {
      setConfirmationData({
        oldPseudo: adminEditData.pseudo,
        oldCourriel: adminEditData.courriel,
        newPseudo: adminNewPseudo,
        newCourriel: adminNewCourriel,
        newPassword: adminNewPassword, 
        id: adminEditData._id
      });
      setShowAdminEditModal(false);
      setShowAdminConfirmModal(true);
    }}>Suivant</button>
  </div>
)}


          <button onClick={() => setShowAdminEditModal(false)} style={{ marginTop: '1rem' }}>Annuler</button>
        </>
      ) : (
        <p style={{ color: 'red' }}>Accès refusé : administrateur requis</p>
      )}
    </div>
  </>
)}
{showAdminConfirmModal && (
  <>
    <div style={overlayStyle} onClick={() => setShowAdminConfirmModal(false)} />
    <div style={modalStyle}>
      <h3>Confirmer les modifications (Admin)</h3>
      <p><strong>ID :</strong> {confirmationData.id}</p>
      <p><strong>Pseudo actuel :</strong> {confirmationData.oldPseudo}</p>
      <p><strong>Nouveau pseudo :</strong> {confirmationData.newPseudo}</p>
      <p><strong>Email actuel :</strong> {confirmationData.oldCourriel}</p>
      <p><strong>Nouveau email :</strong> {confirmationData.newCourriel}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={async () => {
          try {

            const updatedFields = {
              pseudo: confirmationData.newPseudo,
              courriel: confirmationData.newCourriel,
            };

            if (adminNewPassword.trim() !== '') {
              updatedFields.motdepasse = adminNewPassword;
              }

            const res = await fetch(`${backendURL}/profils/${confirmationData.id}`, {
              method: 'PUT',
              headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token  
      },
              body: JSON.stringify(updatedFields)
            });

            if (!res.ok) {
              const data = await res.json();
              if (res.status === 400) {
                setErrorModalMessage(data.message || 'Erreur inconnue');
                setErrorModalVisible(true);
                return;
              } else {
                throw new Error(data.message || 'Erreur inconnue');
              }
            }

            setMessage('Modification réussie (Admin) !');
            setShowAdminConfirmModal(false);
            
          } catch (err) {
            setMessage(err.message);
            setShowAdminConfirmModal(false);
          }
        }} style={{ marginRight: '1rem' }}>Confirmer</button>

        <button onClick={() => setShowAdminConfirmModal(false)}>Annuler</button>
      </div>
    </div>
  </>
)}


{showDeleteModal && (
  <>
    <div style={overlayStyle} onClick={() => setShowDeleteModal(false)} />
    <div style={modalStyle}>
      <h3>Supprimer un utilisateur</h3>
      {!userInfo.isAdmin ? (
        <p style={{ color: 'red' }}>Accès refusé : administrateur requis</p>
      ) : (
        <>
          <label>ID de l'utilisateur :</label>
          <input
            value={deleteUserId}
            onChange={(e) => setDeleteUserId(e.target.value)}
          />
          <div style={{ marginTop: '1rem' }}>
            <button onClick={async () => {
  try {
    
    const res = await fetch(`${backendURL}/profils/${deleteUserId}`, {
        headers: {
        'Content-Type': 'application/json',
        'token': userInfo.token  
      }
});
    if (!res.ok) throw new Error("Utilisateur introuvable");
    const data = await res.json();
    setDeleteUserInfo(data);
    setShowDeleteModal(false);
    setShowDeleteConfirm(true);
  } catch (err) {
    alert(err.message);
  }
}}>Suivant</button>

            <button onClick={() => setShowDeleteModal(false)} style={{ marginLeft: '1rem' }}>Annuler</button>
          </div>
        </>
      )}
    </div>
  </>
)}

{showDeleteConfirm && (
  <>
    <div style={overlayStyle} onClick={() => setShowDeleteConfirm(false)} />
    <div style={modalStyle}>
      {!userInfo.isAdmin ? (
        <p style={{ color: 'red' }}>Accès refusé : administrateur requis</p>
      ) : !deleteUserInfo ? (
        <p>Chargement des informations...</p>
      ) : userInfo.id === deleteUserInfo._id ? (
        <p style={{ color: 'red' }}>Vous ne pouvez pas supprimer votre propre compte.</p>
      ) : (
        <>
          <h3 style={{ color: 'red' }}>Confirmer la suppression</h3>
          <p>Vous allez supprimer l'utilisateur suivant :</p>
          <ul>
            <li><strong>ID :</strong> {deleteUserInfo._id}</li>
            <li><strong>Pseudo :</strong> {deleteUserInfo.pseudo}</li>
            <li><strong>Courriel :</strong> {deleteUserInfo.courriel}</li>
            <li><strong>Type :</strong> {deleteUserInfo.isAdmin ? 'Admin' : 'Utilisateur'}</li>
          </ul>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`${backendURL}/profils/${deleteUserInfo._id}`, {
                    method: 'DELETE',
                    headers:{
                      'Content-Type': 'application/json',
                      'token': userInfo.token
                    }
                  });

                  
                  if (!res.ok) throw new Error("Échec de la suppression");
                  alert("Utilisateur supprimé avec succès");
                  setShowDeleteConfirm(false);
                  setDeleteUserInfo(null);
                } catch (err) {
                  alert(err.message);
                }
              }}
              style={{ color: 'white', backgroundColor: 'red', marginRight: '1rem' }}
            >
              Supprimer
            </button>
            <button onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteUserInfo(null);
            }}>Annuler</button>
          </div>
        </>
      )}
    </div>
  </>
)}


      {errorModalVisible && (
  <>
    <div style={overlayStyle} onClick={() => setErrorModalVisible(false)} />
    <div style={modalStyle}>
      <h3 style={{ color: 'red' }}>Erreur</h3>
      <p>{errorModalMessage}</p>
      <button onClick={() => setErrorModalVisible(false)}>Fermer</button>
    </div>
  </>
)}

      {error && <p style={{ color: 'red', marginTop: '2rem' }}>{error}</p>}
    </div>
  );
  
}

export default Dashboard;
