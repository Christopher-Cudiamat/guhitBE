const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads/');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage, limits:{
  // fileSize:1024*1024*5,
}});



module.exports = {
  uploadImage: (profilePic) => {
    return (req,res, next) => {

      const result = upload.single(profilePic);

    }
    
  },

}