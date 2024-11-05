import React from "react";
import styles from "./styles.module.scss";
import SignInBox from "../SignInBox";

const { signinContainer } = styles;

function Signin({ onLogin }) {
  return (
    <div className={signinContainer}>
      <SignInBox onLogin={onLogin} />
    </div>
  );
}

export default Signin;
