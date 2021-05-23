const express = require('express');
const connectDB = require('./config/db');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const multer = require('multer');
const app = express();

connectDB();

//init middleware
app.use(express.json({ extented: false }));

app.get('/', (req, res) => res.send('Express is Conntected '));

//modal for database
const schema = new Schema({
  img: { data: Buffer, contentType: String },
});

const Photo = mongoose.model('photos', schema);

// Temp Store Image TO server using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');
// post the image to db
app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    try {
      const a = new Photo();
      a.img.data = fs.readFileSync(req.file.path);
      a.img.contentType = req.file.mimetype;
      a.save();
      //Delete the File from the sever after Saving to the Databsse
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return res.status(200).send(a._id);
    } catch (err) {
      console.log(err);
      return res.status(404).json({ msg: 'Error While sending to Database' });
    }
  });
});
//Get the image file from the Id
app.get('/upload/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const image = await Photo.findById({ _id });
    res.send(image);
  } catch (error) {
    res.json({ err: error });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port${PORT}`));
