import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';


const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    useEffect(()=> {
      if(userInfo){
        navigate(redirect);
      }
    },[userInfo,redirect, navigate])


    const submitHandler = async (e) => {
      e.preventDefault();

      const newErrors = {};

      if (!/^[a-zA-Z0-9]{5,15}$/.test(username)) newErrors.username = "Tài khoản gồm 5–15 kí tự, chỉ bao gồm chữ và số";

      if (!email) newErrors.email = "Email không được để trống";
      else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Định dạng email không đúng";

      if (!/^\+?[0-9]{9,15}$/.test(phone)) newErrors.phone = "Số điện thoại không đúng định dạng";

      if (!/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(password)) newErrors.password = "Mật khẩu 6–20 kí tự, gồm chữ và số";

      if (password !== confirmPassword) newErrors.confirmPassword = "2 lần nhập mật khẩu không đồng nhất";

      if (Object.keys(newErrors).length > 0) {
        toast.error(Object.values(newErrors)[0]);
        return;
      }

      try {
        const res = await register({ name: username, email, phone, password }).unwrap();
        dispatch(setCredentials(res));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  return <FormContainer>
    <h1>Đăng Ký</h1>

       

    <Form onSubmit={submitHandler}>
     <Form.Group controlId="username" className="my-3">
            <Form.Label>
                Tài khoản
            </Form.Label>
            <Form.Control type="text" placeholder="Nhập tài khoản" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
            <Form.Label>
                Email
            </Form.Label>
            <Form.Control type="email" placeholder="Nhập email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="phone" className="my-3">
            <Form.Label>
                Số điện thoại
            </Form.Label>
            <Form.Control type="text" placeholder="Nhập số điện thoại" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </Form.Group>

       <Form.Group controlId="password" className="my-3">
            <Form.Label>Mật Khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập Mật Khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text className="bg-white">
                <button type="button" className="btn btn-sm btn-light" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup.Text>
            </InputGroup>
        </Form.Group>

        
       <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Nhập Lại Mật Khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập Lại Mật Khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputGroup.Text className="bg-white">
                <button type="button" className="btn btn-sm btn-light" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup.Text>
            </InputGroup>
        </Form.Group>
        
        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
            Đăng Ký 
        </Button>
        {isLoading && <Loader/>}
    </Form>
    <Row className="py-3">
        <Col>
       Đã có tài khoản? <Link to={redirect ? `/login?redirect=${redirect}`:'/login'}>Đăng Nhập</Link>
        </Col>
    </Row>
  </FormContainer>;};

export default RegisterScreen;
