import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';

const DATA_FOLDER_PATH = './data'
let database

(async () => {
    await checkForFolder(DATA_FOLDER_PATH)
    database = await initDatabase()
    await initDatabaseTables()
})();

async function initDatabase() {
    let db = await new sqlite3.Database('./data/db.sqlite', [sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX]);
    return db;
};

async function initDatabaseTables() {
    await createNewPostsTable()
};

async function checkForFolder(path) {
    try {
        await fs.access(path);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await createNewFolder(path);
        } else {
            throw error;
        }
    }
};

async function createNewFolder(path) {
    try {
        await fs.mkdir(path);
    } catch (error) {
        console.error("Error creating /data folder:", error);
        throw error;
    }
};

async function createNewPostsTable() {
    try {
        database.serialize(() => {
            database.run(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY NOT NULL, 
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_dt NUMERIC NOT NULL,
                    updated_dt NUMERIC NOT NULL
                )
            `);
        });
    } catch (error) {
        throw error;
    }
};

async function addNewPost(body) {
    const datetime = getCurrentDateTime()
    let entry = Object.assign ({
        title: null,
        content: null,
        created_dt: datetime,
        updated_dt: datetime
    },
    body
    );
    try {
        const query = database.prepare(`
            INSERT INTO 
                posts (title, content, created_dt, updated_dt)
            VALUES 
                (?, ?, ?, ?)
        `);
        query.run(entry.title, entry.content, entry.created_dt, entry.updated_dt);
        query.finalize();
    } catch (error) {
        throw error;
    }
};

async function getAllPosts() {
    try {
        const results = await new Promise((resolve, reject) => {
            const query = database.prepare(`
                SELECT
                    *
                FROM 
                    posts
            `);
            query.all((error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
                query.finalize();
            });
        });
        return results;
    } catch (error) {
        throw error;
    }
};

function getCurrentDateTime() {
    // Returns current datetime in YYYY-MM-DD HH:MM:SS, converted to UTC +0
    const datetime = new Date()
    return datetime.toISOString().slice(0, 19).replace('T', ' ');
};

export { 
    initDatabase,
    getAllPosts,
    addNewPost
};