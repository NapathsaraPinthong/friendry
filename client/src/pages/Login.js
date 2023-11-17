import { Link, useNavigate } from "react-router-dom"
import "../style/Login.css"
import Validation from "../LoginValidate"
import { useState } from "react"
import axios from "axios"
import logo from '../asset/logo.png'

const Login = () => {
  const [values, setValues] = useState({
    student_id: '',
    password: ''
  })
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {

        const response = await axios.get(`http://localhost:3001/login/${values.student_id}`)


        if (response.data.length === 0) {
          alert("Student Id not found! Please sign up.");
        } else {
          if (values.password === response.data[0].password) {
            const { student_id, password } = values;
            sessionStorage.setItem("Student_Id", student_id);
            sessionStorage.setItem("Password", password);

            navigate("/");
          } else {
            alert("Incorrect password")
          }
        }

      } catch (err) {
        alert("Log in failed! Please check your Student Id and Password.");

      }
    }
  }
  return (
    <div className="container flex center-box">
      <div>
        <img className="logo"
          src={logo}
          alt="Logo"
        />
        <h5>Let's find Activities !</h5>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input_area">
          <input
            className="login_input"
            type="bigint"
            placeholder="Student ID"
            name="student_id"
            onChange={handleChange}
          />
          {errors.student_id && <span className="invalid">{errors.student_id}</span>}
        </div>
        <div className="input_area">
          <input
            className="login_input"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}

          />
          {errors.password && <span className="invalid">{errors.password}</span>}
        </div>
        <input
          type="submit"
          value="LOG IN"
          className="login-button"
        />
      </form>
      <div>
        <h4 className="h4s">Don't have an account yet?</h4>
        <Link to="/signup">
          <button className="signuplog-button">Sign up</button>
        </Link>
      </div>
    </div>

  )
}
export default Login;