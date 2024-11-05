import React, { useEffect, useState } from "react";
import { Button, Form, Input, Card, Spin, Typography } from "antd";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./styles.module.scss";

const {
  signinContainer,
  signinCard,
  logo,
  logoContainer,
  logoText,
  siteFormItemIcon,
  inputField,
  signinBtn,
  customIcon,
} = styles;

const SignInBox = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const handlePasswordChange = (event) => {
    setIsPasswordEmpty(event.target.value === "");
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await fetch(
        "https://a-m-admin-api.onrender.com/authentication/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { accessToken } = data.data;
        sessionStorage.setItem("authToken", accessToken);
        onLogin(); // Update login state in App.js
        window.location.href = "/";
      } else {
        console.log(data);

        const errorMessage = data.error.message || "An error occurred";
        toast.error(errorMessage, { position: "top-center" }); // Use string directly
      }
    } catch (error) {
      toast.error("Authentication failed. Please check your credentials.", {
        position: "top-center", // Use string directly
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={signinContainer}>
      <Card title="Sign in" className={signinCard}>
        <div className={logoContainer}>
          <img
            src="/assets/images/full_logo.png"
            alt="A&M Logo"
            className={logo}
          />
          <Typography.Title level={4} className={logoText}>
            <span style={{ color: "#1e00ff" }}>A&M</span>{" "}
            <span style={{ color: "#ff0202" }}>Admin</span>
          </Typography.Title>
        </div>

        <Form form={form} name="horizontal_signin" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              prefix={<UserOutlined className={siteFormItemIcon} />}
              placeholder="Email"
              className={inputField}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={siteFormItemIcon} />}
              placeholder="Password"
              iconRender={(visible) =>
                !loading && !isPasswordEmpty ? (
                  visible ? (
                    <EyeTwoTone twoToneColor="#3498db" />
                  ) : (
                    <EyeInvisibleOutlined className={customIcon} />
                  )
                ) : null
              }
              className={inputField}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={loading ? <Spin /> : null}
                disabled={
                  !clientReady ||
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                className={signinBtn}
              >
                Log in
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default SignInBox;
