import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('2 lần nhập mật khẩu không khớp');
      return;
    }

    try {
      const res = await forgotPassword({ email, password }).unwrap();
      toast.success(res.message || 'Mật khẩu đã được cập nhật');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Quên mật khẩu</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Nhập lại mật khẩu</Form.Label>
          <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Form.Group>

        <Button type="submit" className="mt-2" disabled={isLoading}>Cập nhật mật khẩu</Button>
      </Form>
      <Row className="py-3">
        <Col>
          Quay lại <Link to="/login">Đăng Nhập</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
