import db from './database';

class helper{
    async createUser({ name, password }) {
        return await db.User.create({ name, password });
    }
    
    async getAllUsers() {
        return await db.User.findAll();
    }

    async getUser(obj) {
        return await db.User.findOne({ where: obj });
    }
}

module.exports = helper;