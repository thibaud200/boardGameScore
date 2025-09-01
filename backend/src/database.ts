import Database from 'better-sqlite3'

// Chemin relatif à partir de la racine backend
const db = new Database('backend/database/database.db', {
  verbose: console.log
})

export default db
