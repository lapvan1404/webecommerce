import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

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

  // ✅ VALIDATION THEO TÀI LIỆU
  const validate = () => {
    const newErrors = {};

    // Username
    if (!name) {
      newErrors.name = "Tên không được để trống";
    } else if (!/^[a-zA-Z0-9]{5,15}$/.test(name)) {
      newErrors.name = "Tên phải từ 5–15 ký tự, chỉ gồm chữ và số";
    }

    // Password
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6 || password.length > 20) {
      newErrors.password = "Mật khẩu phải từ 6–20 ký tự";
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    // Email (không bắt buộc)
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng";
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
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Đăng Ký</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Tên</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Mật Khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Nhập lại mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
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
