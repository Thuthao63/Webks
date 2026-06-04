const User = require('../models/User');

async function test() {
    const users = await User.findAll({ attributes: ['id', 'email', 'fullName'] });
    console.log(users.map(u => u.toJSON()));
}

test();
