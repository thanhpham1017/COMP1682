const jwt = require('jsonwebtoken');
const AccountModel = require('../models/Account');


const verifyToken = (req, res, next) => {
   
   //
   const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1] //lấy đoạn token, lấy phần tử thứ 1 (chính là token)
   //
   
   // const token = req.cookies.token; 
   // uncomment phần này và comment phần trên nếu lỗi

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify: kiểm tra, cho 2 dữ liệu vào bao gồm token và khóa

		req.accountId = decoded.id 
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
   // try {
   //    var {token} = req.cookies;
   //    var idAccount = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   //    AccountModel.findOne({
   //       _id: idAccount
   //    }).then(data => {
   //       if (data){
   //          req.data = data;
   //          next();  
   //       } else {
   //          res.json('not permnit');
   //       }
   //    }).catch(error => {});
   // } catch (error) {
   //    res.json('token ko hop le');
   // }
};


 //check Admin
 const checkAdmin = (req, res, next) => {
   const accountID = req.accountId;
   console.log(accountID);
   const accountData = AccountModel.findById(accountID);
   if(!accountData){
      return res.status(400).json({success: false, error: "Not found user"});
  }
  const accountRole = accountData.role;
   if (accountRole === 'Admin') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "NOT PERMIT"});
      return;
   }
};

 
const checkBlogger = (req, res, next) => {
   const accountID = req.accountId;
   const accountData = AccountModel.findById(accountID);
   if(!accountData){
      return res.status(400).json({success: false, error: "Not found user"});
  }
  const accountRole = accountData.role;
   if (accountRole === 'Admin' || accountRole === 'Blogger') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "NOT PERMIT"});
      return;
   }
};

const checkGuest = (req, res, next) => {
   const accountID = req.accountId;
   const accountData = AccountModel.findById(accountID);
   if(!accountData){
      return res.status(400).json({success: false, error: "Not found user"});
  }
   const accountRole = accountData.role;
   if (accountRole === 'Guest' || accountRole === 'Admin' || accountRole === 'Blogger') {
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
 
 