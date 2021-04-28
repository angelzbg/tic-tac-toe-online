const SERVER_PORT = process.env.PORT || 5000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/tictactoe';
const SECRET = process.env.SECRET || 'tictactoesecret';

module.exports = { SERVER_PORT, MONGO_CONNECTION_STRING, SECRET };
