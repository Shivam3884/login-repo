const express = require('express');
const collection = require('./mongo');
const app = express();
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');

const path = require('path');
const bcrypt = require('bcryptjs');
const port = 9000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatepath = path.join(__dirname, '../templates');
app.set('views', templatepath);
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.post('/signup', async (req, res) => {
    console.log('Request body:', req.body); 
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }

        const check = await collection.findOne({ name: req.body.username });
        if (check) {
            return res.send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const token = Jwt.sign(
            { name: req.body.username },
            'mynameisshivamtiwarithisismyloginpageufiuwfiuwnbiuvnb'
        );

        const data = {
            password: hashedPassword,
            name: req.body.username,
            token: token
        };

        await collection.insertMany([data]);
        res.redirect('/home'); 
    } catch (error) {
        res.status(500).send('Error during signup');
        console.error('Error during signup:', error);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        res.redirect('/home'); 
    } catch (error) {
        res.status(500).send('Error during login');
        console.error('Error during login:', error);
    }
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
