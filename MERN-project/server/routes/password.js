// routes/password.js

const express = require('express');
const router = express.Router();

// Fonction utilitaire : faire un mot de passe de longeur taille
function genererMotDePasse(taille) {
  const lettresMinuscules = 'abcdefghijklmnopqrstuvwxyz';
  const lettresMajuscules = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chiffres = '0123456789';

  const tousCaracteres = lettresMinuscules + lettresMajuscules + chiffres;

  let motDePasse = '';
  for (let i = 0; i < taille; i++) {
    const indexAleatoire = Math.floor(Math.random() * tousCaracteres.length);
    const caractere = tousCaracteres.charAt(indexAleatoire);
    motDePasse += caractere;
  }

  return motDePasse;
}

// Route GET /motdepasse/:longueur
router.get('/:longueur', (req, res) => {
  const longueurDemandee = parseInt(req.params.longueur);

  // Verifier longeur > 0
  if (isNaN(longueurDemandee) || longueurDemandee <= 0) {
    return res.status(400).json({ message: 'Longueur invalide. Veuillez entrer un nombre positif.' });
  }

  const motdepasse = genererMotDePasse(longueurDemandee);

  res.json({ motdepasse: motdepasse });
});

module.exports = router;
