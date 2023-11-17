import "../style/Signup.css"
import React, { useState } from "react"
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Validation from "../SignupValidate";
import logo from '../asset/logo.png'


export default function Signup() {
  const [values, setValues] = useState({
    student_id: '',
    fname: '',
    lname: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const [errors, setErrors] = useState({});
  //validate and post
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("pass")
    console.info(values)
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      await axios.post('http://localhost:3001/signup', values,
        { headers: { "Content-Type": "application/json" } }
      )
        .then(() => {
          console.log("Successfully signed up!");
          alert("Your account has been successfully created!");
          navigate('/login');
        })
        .catch((err) => { console.log(err) });
    }
  }
  return (
    <div className="container flex">
      <div>
        <img className="logo"
          src={logo}
          alt="Logo"
        />
        <h5>Let's find Activities !</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="signup_area">
          <input
            className="signup_input"
            type="bigint"
            placeholder="Student ID"
            name="student_id"
            onChange={handleChange}
          />
          {errors.student_id && <span className="invalid">{errors.student_id}</span>}
        </div>
        <div className="signup_area">
          <input
            className="signup_input"
            type="text"
            placeholder="First Name"
            name="fname"
            onChange={handleChange}
          />
          {errors.fname && <span className="invalid">{errors.fname}</span>}
        </div>
        <div className="signup_area">
          <input
            className="signup_input"
            type="text"
            placeholder="Last Name"
            name="lname"
            onChange={handleChange}
          />
          {errors.lname && <span className="invalid">{errors.lname}</span>}
        </div>
        <div className="signup_area">
          <input
            className="signup_input"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          {errors.password && <span className="invalid">{errors.password}</span>}
        </div>
        <input
          type="submit"
          value="SIGN UP"
          className="signup-button"
          onSubmit={handleSubmit}
        />
        <div className="bottomdiv">
          <h4>Already a member?</h4>
          <Link to="/login">
            <button className="signtolog-button">Log in</button>
          </Link>
        </div>
      </form>
    </div>

  )
} 