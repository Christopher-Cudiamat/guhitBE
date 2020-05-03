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
      console.log(profilePic)

      const result = upload.single(profilePic);
      console.log("RESULT============",result);
      // req.file.path = result;
      console.log("FILE============",req.body.profilePic)

      // next();

    }
    
  },

}