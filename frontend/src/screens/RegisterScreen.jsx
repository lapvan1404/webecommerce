import React, { useState, useEffect } from "react";
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

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // ================= VALIDATE =================
  const validate = () => {
    const newErrors = {};

    // Tên đăng nhập: chữ + số, 5–15 ký tự
    if (!/^[a-zA-Z0-9]{5,15}$/.test(name)) {
      newErrors.name =
        "Tài khoản gồm 5–15 kí tự, được tạo thành bởi chữ cái và chữ số!";
    }

    // Email
    if (!email) {
      newErrors.email = "Email không được để trống!";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Định dạng mail không đúng!";
    }

    // Mật khẩu: 6–20, chữ + số + ký tự đặc biệt
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,20}$/.test(password)
    ) {
      newErrors.password = "Mật khẩu gồm 6–20 kí tự, gồm chữ, số và ký tự đặc biệt!";
    }

    // Nhập lại mật khẩu
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "2 lần nhập mật khẩu không đồng nhất";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      setErrors({
        api: err?.data?.message || "Đăng ký thất bại",
      });
    }
  };

  return (
    <FormContainer>
      <h1>Đăng Ký</h1>

      <Form onSubmit={submitHandler}>
        {/* TÊN */}
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Tài khoản</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tài khoản"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* EMAIL */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* CONFIRM PASSWORD */}
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Nhập lại mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        {/* API ERROR */}
        {errors.api && (
          <div className="text-danger mb-3">{errors.api}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Đăng Ký
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Đã có tài khoản?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Đăng Nhập
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
