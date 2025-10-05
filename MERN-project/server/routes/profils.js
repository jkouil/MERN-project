const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('./User');
const router = express.Router();
const authMiddleware = require('./authMiddleware');

// read api from env
const ZERUH_API_KEY = process.env.ZERUH_API;

router.post('/', async (req, res) => {
  const { pseudo, courriel, motdepasse, isAdmin } = req.body;

  try {
    // verifier email
    const emailCheckUrl = `https://api.zeruh.com/v1/verify?api_key=${ZERUH_API_KEY}&email_address=${courriel}`;
    const emailResponse = await fetch(emailCheckUrl);
    const emailData = await emailResponse.json();

    if (
      !emailData.success ||
      emailData.result.status === 'undeliverable' ||
      emailData.result.validation_details.smtp_check === false
    ) {
      return res.status(400).json({ message: 'Adresse courriel invalide ou inexistante.' });
    }

    // check if exist
    const existingUser = await User.findOne({ courriel });
    if (existingUser) {
      return res.status(400).json({ message: "Courriel déjà utilisé" });
    }

    // hash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(motdepasse, salt);

    // new user
    const newUser = new User({
      pseudo,
      courriel,
      passwordHash,
      isAdmin: isAdmin || false
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès", id: newUser._id });

  } catch (err) {
    console.error("Erreur lors de la création d’utilisateur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ID：GET /profils/pseudo/:pseudo
router.get('/pseudo/:pseudo', async (req, res) => {
  try {
    const user = await User.findOne({ pseudo: req.params.pseudo });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ id: user._id });
  } catch (err) {
    console.error("Erreur lors de la recherche par pseudo:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /profils/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    
    if (!req.auth.isAdmin && req.params.id !== req.auth.userId) {
      return res.status(403).json({ message: 'Accès refusé : vous ne pouvez consulter que votre propre profil.' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash'); 
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la lecture par ID:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.get('/', authMiddleware,async (req, res) => {
  if (!req.auth.isAdmin) {
    return res.status(403).json({ message: "Accès refusé : administrateur requis" });
  }

  try {
    const users = await User.find({}, '-passwordHash'); 
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.put('/:id', authMiddleware,async (req, res) => {
  try {
    const { pseudo, courriel, motdepasse } = req.body; 
    const userId = req.params.id;

    if (req.auth.userId !== userId && !req.auth.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé : vous ne pouvez modifier que votre propre profil.' });
    }

    // find this user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // email changed?
    const emailChanged = courriel && courriel !== user.courriel;

    if (emailChanged) {
      // email exist?
      const emailCheckUrl = `https://api.zeruh.com/v1/verify?api_key=${ZERUH_API_KEY}&email_address=${courriel}`;
      const emailResponse = await fetch(emailCheckUrl);
      const emailData = await emailResponse.json();

      if (
        !emailData.success ||
        emailData.result.status === 'undeliverable' ||
        emailData.result.validation_details.smtp_check === false
      ) {
        return res.status(400).json({ message: 'Adresse courriel invalide ou inexistante.' });
      }

      // except self, check email used by other user
      const existingUser = await User.findOne({ courriel });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Ce courriel est déjà utilisé par un autre utilisateur.' });
      }
    }

    
    user.pseudo = pseudo;
    user.courriel = courriel;


    if (motdepasse && motdepasse.trim() !== '') { 
      const hashedPassword = await bcrypt.hash(motdepasse, 10); 
      user.passwordHash = hashedPassword; 
    }

    await user.save();

    res.json({
      message: 'Utilisateur mis à jour avec succès.',
      pseudo: user.pseudo,
      courriel: user.courriel,
      isAdmin: user.isAdmin,
      _id: user._id,
    });

  } catch (error) {
    console.error('Erreur PUT /profils/:id', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.delete('/:id', authMiddleware,async (req, res) => {
  if (!req.auth.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé : vous ne pouvez pas supprimer les profils.' });
    }
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
