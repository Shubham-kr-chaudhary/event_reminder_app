require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const cron = require('node-cron');

const User = require('./models/User');
const Event = require('./models/Event');
const Subscription = require('./models/Subscription');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.client_URL }));


mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);


const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.get('/api/events', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user }).sort({ date: 1 });
    res.json(events);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/events', auth, async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, userId: req.user });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/subscribe', auth, async (req, res) => {
  const subscription = req.body;
  await Subscription.findOneAndUpdate(
    { userId: req.user },
    { userId: req.user, ...subscription },
    { upsert: true, new: true }
  );
  res.status(201).json({});
});

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const thirtyMinsLater = new Date(now.getTime() + 30 * 60000);
  
  try {
    const events = await Event.find({
      date: { $gt: now, $lte: thirtyMinsLater },
      notified: false
    });

    if (events.length > 0) {
      console.log(`🔔 Found ${events.length} events to notify.`);
      
      for (const event of events) {
        const sub = await Subscription.findOne({ userId: event.userId });
        if (sub) {
          const payload = JSON.stringify({ title: 'Reminder', body: `${event.title} is starting soon!` });
          try {
            await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
            event.notified = true;
            await event.save();
            console.log(`✅ Notification sent for: ${event.title}`);
          } catch (error) {
            if(error.statusCode === 410) await Subscription.findByIdAndDelete(sub._id);
            console.error('Push Error:', error.statusCode);
          }
        }
      }
    }
  } catch (error) { console.error('Cron Error:', error); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));