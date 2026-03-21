const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name: name || '', email, password: hashedPassword });

    // --- Create a dedicated folder for the new user and save signup info ---
    try {
      const safeName = name ? name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'user';
      const folderName = `${safeName}_${user.id}`;
      const userFolderPath = path.join(__dirname, '..', 'user_data', folderName);

      // Ensure user_data base folder and the user folder exist
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      // Save user signup info to a JSON file
      const userInfoFile = path.join(userFolderPath, 'user_info.json');
      const infoToSave = {
        userId: user.id,
        name: name,
        email: email,
        signupDate: new Date().toISOString(),
        status: 'active'
      };
      fs.writeFileSync(userInfoFile, JSON.stringify(infoToSave, null, 2));
      console.log(`📂 Physical folder and info file created for user: ${email}`);
    } catch (fsErr) {
      console.error('⚠️ Failed to create user physical folder:', fsErr.message);
      // We don't block registration if folder creation fails, but we log it
    }
    // -----------------------------------------------------------------------

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      userId: user.id,
      name: user.name || '',
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, avatar, bio, phone, location } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ 
      name: name !== undefined ? name : user.name,
      avatar: avatar !== undefined ? avatar : user.avatar,
      bio: bio !== undefined ? bio : user.bio,
      phone: phone !== undefined ? phone : user.phone,
      location: location !== undefined ? location : user.location,
    });
    
    const updated = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await user.update({ password: hashedPassword });
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
