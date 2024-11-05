import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEndpoints from "../../hooks/useEndpoint";

import styles from "./styles.module.scss";

const {
  loginContainer,
  loginBox,
  logo,
  formGroup,
  signInButton,
  errorText,
  formContainer,
  visibilityIcon,
  visibilityOffIcon,
  passwordInput,
} = styles;

function SignInBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useEndpoints();

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    const isEmailValid = email && isValidEmail(email);
    const isPasswordValid = password && password.length >= 8;

    if (!isEmailValid) {
      setEmailError("Please enter a valid email.");
    }
    if (!isPasswordValid) {
      setPasswordError("Password must be at least 8 characters.");
    }

    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      try {
        const response = await signIn({ username: email, password });
        if (response?.status === 200) {
          window.location.href = "/";
        } else {
          const errorMessage = response?.data?.message || "An error occurred";
          toast.error(errorMessage, { position: toast.POSITION.TOP_CENTER });
        }
      } catch (error) {
        if (error.response.status === 403) {
          toast.error(
            "You do not have access to this system. Please enter HR account.",
            {
              position: toast.POSITION.TOP_CENTER,
            }
          );
        } else {
          toast.error("Authentication failed. Please check your credentials.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  return (
    <div className={loginContainer}>
      <div className={loginBox}>
        <div className={logo}>
          <img src="/assets/images/NPC Logo-04.png" alt="Logo" />
          <p>HR Employment</p>
        </div>
        <div className={formContainer}>
          <div className={formGroup}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <AccountCircleIcon
                sx={{ color: "#757575", marginRight: 1, marginBottom: 0.5 }}
              />
              <TextField
                id="email"
                label="Email"
                variant="standard"
                color="info"
                required
                fullWidth
                value={email}
                error={Boolean(emailError)}
                helperText={emailError}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Box>
          </div>
          <div className={formGroup}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <LockIcon
                sx={{ color: "#757575", marginRight: 1, marginBottom: 0.5 }}
              />
              <TextField
                id="password"
                label="Password"
                variant="standard"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={password}
                error={Boolean(passwordError)}
                helperText={passwordError}
                className={passwordInput}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{ display: "flex", alignItems: "center" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <VisibilityIcon className={visibilityIcon} />
                      ) : (
                        <VisibilityOffIcon className={visibilityOffIcon} />
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </div>
          <div className={formGroup}>
            <Button
              variant="contained"
              onClick={handleLogin}
              className={signInButton}
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <AccountCircleIcon style={{ marginLeft: 8 }} />
                )
              }
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignInBox;
