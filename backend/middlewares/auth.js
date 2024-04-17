const jwt = require('jsonwebtoken');

// //check login only
// const checkLoginSession = (req, res, next) => { //chỉ check login, ko phân quyền
//     if (req.session.email) {
//        next();
//     } else {
//        res.redirect('/auth/login');
//     }
//  };

 //check Admin
const checkAdminSession = (req, res, next) => {
   if (req.session.email && req.session.role == '') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Admin session"});
      return;
   }
};

 
const checkGuestSession = (req, res, next) => {
   if (req.session.email && req.session.role == '') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Guest session"});
      return;
   }
};
 
const checkBloggerSession = (req, res, next) => {
   if (req.session.email && req.session.role == '') {
      next();
   }
   else {
      res.status(500).json({success: false, error: "Error Blogger session"});
      return;
   }
};


//------------------------Token----------------------------------------------------------------
//Authorization: Bearer          sfsfsfsfsefsfsf   -> đây là Authorization
//               (cần xóa)            token
//đây chỉ là check token, nghĩa là xem người dùng đã login chưa vì nếu đã login rồi thì mới có token
const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1] //lấy đoạn token, lấy phần tử thứ 1 (chính là token)

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify: kiểm tra, cho 2 dữ liệu vào bao gồm token và khóa

		req.userId = decoded.userId //gán userID vào req, req ko chỉ có các trường dữ liệu name, dob,.... mà còn có thêm userId //có thể lấy userID ở các route khác: const userID = req.userID
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
};
//---------------------------------------------------------------------------------------------------

//-------------
 module.exports = {
    checkAdminSession,
    checkGuestSession,
    checkBloggerSession,
    verifyToken
 }
 
 