const db = require("../postgres/db");

const userModel = {
    getUserByUsername: async (username) => {
        const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
        return result.rows[0];
    },

    createUser: async ({ username, password }) => {
        await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, password]
        );
    }
}

module.exports = userModel;