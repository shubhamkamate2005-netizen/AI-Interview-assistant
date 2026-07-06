import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Brand from "../../../components/Brand";
import Icon from "../../../components/Icon";

const Register = () => {
  const navigate = useNavigate();
  const [username,setusername]=useState("")
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  
  const {loading,error,handleRegister}=useAuth()
  const handlesubmit=async(e)=>{
    e.preventDefault()
    const success=await handleRegister({username,email,password})
    if(success){
      navigate("/")
    }

  }
  return (
     <main className="auth-page">
      <section className="auth-story">
        <Brand/>
        <div><span className="eyebrow">Plan. Practice. Progress.</span><h1>Your next role deserves a real strategy.</h1><p>Careerly connects your experience to the job and builds a focused interview plan around the gaps.</p></div>
        <div className="feature-chips"><span><Icon name="check" size={15}/>Role match score</span><span><Icon name="check" size={15}/>Interview questions</span><span><Icon name="check" size={15}/>Daily action plan</span></div>
      </section>
      <section className="auth-panel">
      <div className="form-container">
        <span className="auth-icon"><Icon name="user"/></span>
        <div className="form-heading"><h2>Create your account</h2><p>Start preparing with a plan made for you.</p></div>
        <form onSubmit={handlesubmit}>
          <div className="input-group">
            <label htmlFor="username">UserName</label>
            <input required minLength="2" maxLength="50" autoComplete="name"
            onChange={(e)=>{
              setusername(e.target.value)
            }}
            type="text" id="username" name="username" placeholder="Enter UserName"/>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input required autoComplete="email"
            onChange={(e)=>{
              setemail(e.target.value)
            }}
            type="email" id="email" name="email" placeholder="Enter email"/>
          </div>
           <div className="input-group">
            <label htmlFor="password">Password</label>
            <input required minLength="8" maxLength="72" autoComplete="new-password"
            onChange={(e)=>{
              setpassword(e.target.value)
            }}
            type="password" id="password" name="password" placeholder="Enter password"/>
          </div>
          <small className="field-hint">Use at least 8 characters.</small>
          {error && <p className="form-error" role="alert"><Icon name="alert" size={16}/>{error}</p>}
          <button disabled={loading} className='button primary-button'>{loading ? <><span className="mini-spinner"/>Creating account...</> : <>Create account <Icon name="arrow" size={17}/></>}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to={"/login"}>Sign in</Link></p>
      </div>
      </section>
    </main>
  )
}

export default Register
