const db =  require("../postgres/db");

const postModel = {
    getAll: async() => {
        const result = await db.query("select * from posts order by created_at");
        return result.rows;
    },

    getPostById: async (id) => {
        const result = await db.query("select * from posts where id=$1", [id]);
        return result.rows[0];
    },

    createNewPost: async ({title, content, author_id}) => {
        await db.query("insert into posts (title, content, user_id) values ($1, $2, $3)", [title, content, author_id]);
    },

    deletePostById: async(id) => {
        await db.query("delete from posts where id=$1", [id]);
    },

    updatePostById: async({title, content, id}) => {
        await db.query("update posts set title=$1, content=$2 where id=$3", [title, content, id]);
    }
}

module.exports = postModel;