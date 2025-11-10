const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../backend/models/User');
const connectDB = require('../../backend/db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ msg: 'Method Not Allowed' }) };
  }

  await connectDB();

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ msg: 'Invalid JSON' }) };
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return { statusCode: 400, body: JSON.stringify({ msg: 'All fields required' }) };
  }

  try {
    let user = await User.findOne({ email });
    if (user) return { statusCode: 400, body: JSON.stringify({ msg: 'User already exists' }) };

    const userid = 'UID' + Date.now().toString().slice(-6);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, userid });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        token,
        redirect: '/dashboard.html',
        user: { name, email, userid, wallet: 0 }
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ msg: 'Server error' }) };
  }
};
