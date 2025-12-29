const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // ===== 1. Validate Username =====
  if (!name) {
    res.status(400);
    throw new Error('Username không được để trống');
  }

  if (name.length < 5 || name.length > 15) {
    res.status(400);
    throw new Error('Username phải từ 5 đến 15 ký tự');
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(name)) {
    res.status(400);
    throw new Error('Username chỉ được chứa chữ và số');
  }

  // ===== 2. Validate Password =====
  if (!password) {
    res.status(400);
    throw new Error('Password không được để trống');
  }

  if (password.length < 6 || password.length > 20) {
    res.status(400);
    throw new Error('Password phải từ 6 đến 20 ký tự');
  }

  // ===== 3. Validate Email (cho phép trống) =====
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Email không đúng định dạng');
    }
  }

  // ===== 4. Check user tồn tại =====
  const userExists = email ? await User.findOne({ email }) : null;

  if (userExists) {
    res.status(400);
    throw new Error('Email đã tồn tại');
  }

  // ===== 5. Tạo user =====
  const user = await User.create({
    name,
    email: email || null,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});
