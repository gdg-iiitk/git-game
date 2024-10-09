import { MongoClient, ServerApiVersion } from 'mongodb';


const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}


const writeData = async (params ) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const coll = db.collection(params.collection);
    await coll.insertMany(params.data);
}

const readDataMany = async (params) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const coll = db.collection(params.collection);
    const res = await coll.find(params.query).toArray()
    return res.map((obj) => {
        delete obj['_id']
        return obj
    })
}

const readDataOne = async (params) => {
    const client = await  clientPromise;
    const db = client.db(process.env.DB_NAME);
    const coll = db.collection(params.collection);
    const res = await coll.findOne(params.query)
    return res

}



const updateDataOne = async (params) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const coll = db.collection(params.collection);
    const res = await coll.updateOne(params.query, {
        $set: params.newdata
    })
    return res
}


const deleteDataMany = async (params) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME)
    const coll = db.collection(params.collection)
    const res = await coll.deleteMany(params.query)
    return res
}
const deleteDataOne = async (params) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME)
    const coll = db.collection(params.collection)
    const res = await coll.deleteOne(params.query)
    return res
}
export {
    writeData,
    readDataOne,
    readDataMany,
    updateDataOne,
    deleteDataMany,
    deleteDataOne,
}