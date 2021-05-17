module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://root:rootroot@cluster0.5a0xw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'sl_myJwtSecret'
};
  