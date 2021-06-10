const crypto = require('crypto')
const express = require('express');

const app = express();

const users = [
    {
        name: 'Daniel',
        age: 20,
        gender: 'male'
    },
    {
        name: 'Nastya',
        age: 18,
        gender: 'female'
    }
]

app.use(express.json())

app.get('/users', async (req, res) => {
    const etagHash = computeHash(JSON.stringify(users));

    const sentETag = req.headers['if-none-match'];

    if (etagHash === sentETag) {
        res.status(304).end();
        return;
    }

    res.writeHead(200, { 'ETag': etagHash });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users))
})

app.post('/users', async (req, res) => {
    const { name, age, gender } = req.body;

    users.push({name, age, gender});
    res.json(users)
})

app.listen(4000, () => console.log('server is started on port 4000'))

const computeHash = (str) => {
    return crypto.createHmac('sha256', 'mysupersecretkeyidontcareaboutit').update(str).digest('hex');
}
