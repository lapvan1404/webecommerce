import { React, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ❗ error states
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const validate = () => {
    const newErrors = {};

    // username
    if (!/^[a-zA-Z0-9]{5,15}$/.test(name)) {
      newErrors.name =
        "Tài khoản gồm 5–15 ký tự, chỉ bao gồm chữ cái và chữ số!";
    }

    // email
    if (!email) {
      newErrors.email = "Email không được để trống!";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng!";
    }

    // password
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,20}$/.test(password)) {
      newErrors.password =
        "Mật khẩu 6–20 ký tự, gồm chữ, số và ký tự đặc biệt!";
    }

    // confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Hai mật khẩu không trùng khớp!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      setErrors({ api: err?.data?.message || "Đăng ký thất bại!" });
    }
  };

  return (
    <FormContainer>
      <h1>Đăng Ký</h1>

      <Form onSubmit={submitHandler}>
        {/* USERNAME */}
        <Form.Group className="my-3">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* EMAIL */}
        <Form.Group className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className="my-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* CONFIRM PASSWORD */}
        <Form.Group className="my-3">
          <Form.Label>Xác nhận mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        {errors.api && <div className="text-danger mb-2">{errors.api}</div>}

        <Button type="submit" disabled={isLoading}>
          Đăng Ký
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Đã có tài khoản?{" "}
          <Link to={`/login?redirect=${redirect}`}>Đăng Nhập</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
