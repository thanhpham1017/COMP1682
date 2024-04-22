const jwt = require('jsonwebtoken');
const AccountModel = require('../models/Account');


//------------------------Token----------------------------------------------------------------
//Authorization: Bearer          sfsfsfsfsefsfsf   -> đây là Authorization
//               (cần xóa)            token
//đây chỉ là check token, nghĩa là xem người dùng đã login chưa vì nếu đã login rồi thì mới có token
// const verifyToken = (req, res, next) => {
// 	const authHeader = req.header['Authorization'];
// 	const token = authHeader.split(' ')[1]; //lấy đoạn token, lấy phần tử thứ 1 (chính là token)

// 	if (!token)
// 		return res
// 			.status(401)
// 			.json({ success: false, message: 'Access token not found' })

// 	try {
// 		var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify: kiểm tra, cho 2 dữ liệu vào bao gồm token và khóa

// 		// req.userId = decoded.userId //gán userID vào req, req ko chỉ có các trường dữ liệu name, dob,.... mà còn có thêm userId //có thể lấy userID ở các route khác: const userID = req.userID
// 		if (decoded){
//          next()
//       }
// 	} catch (error) {
// 		console.log(error)
// 		return res.status(403).json({ success: false, message: 'Invalid token' })
// 	}
// };
//---------------------------------------------------------------------------------------------------

const verifyToken = (req, res, next) => {
   try {
      var token = req.cookies.token;
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
 
 