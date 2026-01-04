import { useState, useEffect } from "react";
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
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!/^[a-zA-Z0-9]{5,15}$/.test(name)) {
      newErrors.name =
        "Tài khoản gồm 5–15 kí tự, chỉ bao gồm chữ cái và chữ số!";
    }

    if (!email) {
      newErrors.email = "Email không được để trống!";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Định dạng email không đúng!";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,20}$/.test(password)) {
      newErrors.password =
        "Mật khẩu 6–20 kí tự, gồm chữ, số và kí tự đặc biệt!";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "2 lần nhập mật khẩu không đồng nhất";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
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
        <Form.Group className="my-3">
          <Form.Label>Tên</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Mật Khẩu</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password}</div>
          )}
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Nhập Lại Mật Khẩu</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <div style={{ color: "red" }}>{errors.confirmPassword}</div>
          )}
        </Form.Group>

        {errors.api && <div style={{ color: "red" }}>{errors.api}</div>}

        <Button type="submit" className="mt-2">
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
