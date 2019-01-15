const connectURI = 'mongodb+srv://node-user:'+process.env.MONGO_ATLAS_PW+'@cluster0-5mmfo.mongodb.net/test?retryWrites=true'
// const connectURI = 'mongodb://localhost:27017/node-user'

module.exports = {
  connectURI
};