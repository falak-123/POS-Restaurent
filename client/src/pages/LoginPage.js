import { message, Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      const res = await axios.post("/api/users/login", value);
      message.success(res.data.message);
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className="register">
        <div className="regsiter-form">
          <h1>POS APP</h1>
          <h3>Login Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="userId" label="User ID">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between">
              <p>
                not a user Please
                <Link to="/register"> Register Here !</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
