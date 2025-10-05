// routes/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('./User'); 

const JWT_SECRET = process.env.JWT_SECRET || 'aaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssss'; 

// POST /login
router.post('/', async (req, res) => {
  const { courriel, motdepasse } = req.body;

  try {
    const user = await User.findOne({ courriel });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(motdepasse, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    
    const token = jwt.sign(
      { userId: user._id.toString(), isAdmin: user.isAdmin }, 
      JWT_SECRET,
      { expiresIn: '12h' }
    );

   
    return res.json({
      message: 'Connexion réussie !',
      token, 
      pseudo: user.pseudo,
      isAdmin: user.isAdmin,
      id: user._id,
      courriel: user.courriel
    });

  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
