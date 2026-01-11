import {React, useState,useEffect } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col, InputGroup} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import {setCredentials} from '../slices/authSlice';
import {toast} from 'react-toastify';


const LoginScreen = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login,{isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    useEffect(()=> {
      if(userInfo){
        navigate(redirect);
      }
    },[userInfo,redirect, navigate])


    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            // store credentials in redux
            dispatch(setCredentials({...res}));
            // respect remember checkbox: if not remembered, move to sessionStorage
            if (!remember) {
              sessionStorage.setItem('userInfo', JSON.stringify(res));
              localStorage.removeItem('userInfo');
            }
            navigate(redirect);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  return <FormContainer>
    <h1>Đăng Nhập</h1>
    <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
            <Form.Label>
                Email
            </Form.Label>
            <Form.Control type="email" placeholder="Nhập email" value={email} onChange={(e)=>setEmail(e.target.value)}>

            </Form.Control>
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

        <Form.Group controlId="remember" className="mb-3">
          <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center">
          <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
              Đăng Nhập 
          </Button>
          <Link to="/forgot" className="mt-3">Quên mật khẩu?</Link>
        </div>
        {isLoading && <Loader/>}
    </Form>
    <Row className="py-3">
        <Col>
       Nếu bạn chưa có tài khoản? <Link to={redirect ? `/register?redirect=${redirect}`:'/register'}>Đăng Ký</Link>
        </Col>
    </Row>
  </FormContainer>;
};

export default LoginScreen;
