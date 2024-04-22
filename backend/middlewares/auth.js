const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   try {
      var {token} = req.cookies;
      var idAccount = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      AccountModel.findOne({
         _id: idAccount
      }).then(data => {
         if (data){
            req.data = data;
            next();  
         } else {
            res.json('not permnit');
         }
      }).catch(error => {});
   } catch (error) {
      res.json('token ko hop le');
   }
};


 //check Admin
 const checkAdmin = (req, res, next) => {
   var role = req.data.role;
   if (role === 'Admin') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "NOT PERMIT"});
      return;
   }
};

 
const checkBlogger = (req, res, next) => {
   var role = req.data.role;
   if (role === 'Admin' || role === 'Blogger') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "NOT PERMIT"});
      return;
   }
};

const checkGuest = (req, res, next) => {
   var role = req.data.role;
   if (role === 'Guest' || role === 'Admin' || role === 'Blogger') {
      next();
   }
   else {
      return res.status(500).json({success: false, error: "NOT PERMIT"});
   }
};

//-------------
 module.exports = {
    checkAdmin,
    checkGuest,
    checkBlogger,
    verifyToken
 }
 
 