require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Bottle = require('./models/bottle');
const Transaction = require('./models/transaction');
const Raffle = require('./models/raffle');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Authentication middleware
function authenticateToken(req, res, next) {
    console.log(res.header)
      const token = req.header('Authorization');
      if (!token) return res.sendStatus(401);
      console.log(token)
  
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
}

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!username || !password) {
        return res.status(400).json({ error: 'All feilds required' });
    }

    const user = new User({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User Created Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/signin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }else if(!username || !password){
        return res.status(400).json({ error: 'All feilds required' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
            const token = jwt.sign({ username: user.username,id: user.id },process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful',token: token });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


app.post('/add-bottle',authenticateToken, async (req, res) => {
    try {
      const { name, brand } = req.body;

      if (!name || !brand ) {
        return res.status(400).json({ error: 'All feilds required' });
      }

      const bottle = new Bottle({ name, brand });
  
      await bottle.save();
  
      res.status(201).json({ message: 'Bottle added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.post('/bottle-transaction',authenticateToken, async (req, res) => {
  try {
    const { bottleId } = req.body;
    const userId = req.user.id; 

    if (!bottleId || !userId ) {
      return res.status(400).json({ error: 'All feilds required' });
    }

    const bottleTransaction = new Transaction({ bottleId, userId });

    await bottleTransaction.save();

    res.status(201).json({ message: 'Bottle added to bin' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user-bottles', authenticateToken, async (req, res) => {
    try {  
      const userBottles = await Bottle.find();
  
      res.status(200).json(userBottles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  app.post('/set-raffle', authenticateToken, async (req, res) => {
    try {
      const { count } = req.body;
      const userId = req.user.id;
  
      if (!count) {
        return res.status(400).json({ error: 'Fields required' });
      }
  
      const transactions = await Transaction.find({})
        .sort({ createdDate: -1 }) 
        .limit(count);
  
      for (const transaction of transactions) {
        await Transaction.findByIdAndUpdate(transaction._id, { raffle: 1 });

        const raffle = new Raffle({ transactionId: transaction._id });
        await raffle.save();
      }
  
      res.status(201).json({ message: 'Bottle(s) added successfully to raffle' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.get('/count-raffle-pending', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const count = await Transaction.countDocuments({ userId, raffle: 0 });
  
      res.status(200).json({ Count : count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
