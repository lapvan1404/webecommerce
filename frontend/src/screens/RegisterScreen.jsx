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

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Username: chữ + số, 5–15 ký tự
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!usernameRegex.test(name)) {
      toast.error(
        "Tên đăng nhập chỉ gồm chữ và số, độ dài từ 5 đến 15 ký tự"
      );
      return;
    }

    // ✅ Email: bắt buộc + đúng định dạng
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) {
      toast.error("Email không được để trống");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    // ✅ Password: 6–20 ký tự (cho phép chữ, số, ký tự đặc biệt)
    if (password.length < 6 || password.length > 20) {
      toast.error("Mật khẩu phải có độ dài từ 6 đến 20 ký tự");
      return;
    }

    // ✅ Confirm password
    if (password !== confirmPassword) {
      toast.error("Hai mật khẩu không trùng khớp");
      return;
    }

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
        {/* TÊN ĐĂNG NHẬP */}
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Text className="text-muted">
            Chỉ gồm chữ và số, độ dài 5–15 ký tự
          </Form.Text>
        </Form.Group>

        {/* EMAIL */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {/* MẬT KHẨU */}
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Text className="text-muted">
            Độ dài từ 6–20 ký tự, có thể gồm chữ, số và ký tự đặc biệt
          </Form.Text>
        </Form.Group>

        {/* NHẬP LẠI MẬT KHẨU */}
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Nhập lại mật khẩu</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

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
