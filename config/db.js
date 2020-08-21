const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(`Notice Err: ${err.message}`);  
    // Exit process with failure
    process.exit(1); // khi co loi, stop chuong trinh luon, neu ko co line nay, chuong trinh continues, mac du co loi
  } // Asynchonous
};

module.exports = connectDB;
