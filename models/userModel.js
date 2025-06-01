const db = require("../postgres/db");

const userModel = {
    getUserByUsername: async (username) => {
        const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
        return result.rows[0];
    },

    getUserByEmail: async (email) => {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        return result.rows[0];
    },

    createUser: async ({ email, username, password }) => {
        await db.query(
            "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
            [email, username, password]
        );
    }
}

module.exports = userModel;