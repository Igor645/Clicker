const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const app = express();

const uri = 'mongodb+srv://admin:admin@clicker.n6utxmh.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.listen(port, () => console.log(`Server running on port ${port}`));

app.post('/api/register', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('Clicker').collection('Users');

    const { username, password, gameplayData } = req.body;

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUser = await collection.insertOne({ username, password: hashedPassword, gameplayData });
    const userId = insertedUser.insertedId;

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/login', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('Clicker').collection('Users');

    const { username, password } = req.body;

    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const userId = user._id;

    res.json({ message: 'Login successful', userData: user, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/user/:userId/gameData', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db('Clicker').collection('Users');
        const userId = req.params.userId;
        const user = await collection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const gameplayData = user.gameplayData;
      res.json({ gameplayData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  app.post('/api/user/:userId/gameData', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedGameData = req.body;

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const collection = client.db('Clicker').collection('Users');

        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { gameplayData: updatedGameData } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Game data updated successfully' });

        await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/user/:userId/username', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db('Clicker').collection('Users');
        const userId = req.params.userId;
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const username = user.username;
        res.json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
