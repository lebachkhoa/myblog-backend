const db =  require("../postgres/db");

const postModel = {
    getAll: async() => {
        const result = await db.query("select * from posts order by created_at desc");
        return result.rows;
    },

    getPostById: async (id) => {
        const result = await db.query("select * from posts where id=$1", [id]);
        return result.rows[0];
    },

    createNewPost: async ({title, content, user_id, category_id}) => {
        await db.query("insert into posts (title, content, user_id, category_id) values ($1, $2, $3, $4)", [title, content, user_id, category_id]);
    },

    deletePostById: async(id) => {
        await db.query("delete from posts where id=$1", [id]);
    },

    updatePostById: async({id, title, content, user_id, category_id}) => {
        await db.query("update posts set title=$1, content=$2, category_id=$3 where id=$4 and user_id=$5", [title, content, category_id, id, user_id]);
    }
}

module.exports = postModel;