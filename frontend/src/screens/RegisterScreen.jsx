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
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!/^[a-zA-Z0-9]{5,18}$/.test(name)) {
      err.name = "Tài khoản gồm 5–18 ký tự, được tạo thành bởi chữ cái và chữ số!";
    }

    if (!email) {
      err.email = "Email không được để trống!";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      err.email = "Email không đúng định dạng!";
    }

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,20}$/.test(password)
    ) {
      err.password =
        "Mật khẩu 6–20 ký tự, gồm chữ, số và ký tự đặc biệt!";
    }

    if (confirmPassword !== password) {
      err.confirmPassword = "Hai mật khẩu không trùng khớp!";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Đăng Ký</h1>

      <Form onSubmit={submitHandler}>
        {/* USERNAME */}
        <Form.Group className="my-3">
          <Form.Label>Tài khoản</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Nhập tài khoản"
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
          />
          {errors.name && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.name}
            </div>
          )}
        </Form.Group>

        {/* EMAIL */}
        <Form.Group className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Nhập email"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.email}
            </div>
          )}
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className="my-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Nhập mật khẩu"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.password}
            </div>
          )}
        </Form.Group>

        {/* CONFIRM PASSWORD */}
        <Form.Group className="my-3">
          <Form.Label>Xác nhận mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Nhập lại mật khẩu"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirmPassword: "" });
            }}
          />
          {errors.confirmPassword && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.confirmPassword}
            </div>
          )}
        </Form.Group>

        <Button type="submit" disabled={isLoading}>
          Đăng Ký
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Đã có tài khoản?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Đăng nhập
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
