const db = require("../../data/dbConfig")

async function add(cred){
    const [id] = await db("users").insert(cred)

    return findById(id)
}

function find() {
    return db("users").select("id", "username")
}

function findBy(filter){
    return db("users")
          .select("id", "username", "password")
          .where(filter)
}

function findById(id) {
    return db("users")
        .select("id", "username", "password")
        .where( { id })
        .first()
}

module.exports = {
    add,
    find,
    add,
    findBy,
    findById,
}