import { useNavigate,Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import Brand from "../../../components/Brand";
import Icon from "../../../components/Icon";


const Login = () => {
  const {loading,error,handleLogin}=useAuth()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const navigate=useNavigate();

  const handlesubmit=async (e)=>{
    e.preventDefault()
    const success=await handleLogin({email,password})
    if(success){
      navigate('/')
    }

  }
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Brand/>
        <div><span className="eyebrow">Your AI career copilot</span><h1>Turn every application into a stronger opportunity.</h1><p>Understand your fit, prepare smarter, and walk into interviews knowing exactly what to say.</p></div>
        <div className="auth-proof"><div className="proof-avatars"><span>A</span><span>M</span><span>R</span></div><p><strong>Built for ambitious candidates</strong><br/>Personalized strategy in minutes, not hours.</p></div>
      </section>
      <section className="auth-panel">
      <div className="form-container">
        <span className="auth-icon"><Icon name="sparkles"/></span>
        <div className="form-heading"><h2>Welcome back</h2><p>Sign in to continue your career journey.</p></div>
        <form onSubmit={handlesubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input required autoComplete="email"
            onChange={(e)=>setemail(e.target.value)}
            type="email" id="email" name="email" placeholder="Enter email"/>
          </div>
           <div className="input-group">
            <label htmlFor="password">Password</label>
            <input required minLength="8" autoComplete="current-password"
            onChange={(e)=>{setpassword(e.target.value)}}
            type="password" id="password" name="password" placeholder="Enter password"/>
          </div>
          {error && <p className="form-error" role="alert"><Icon name="alert" size={16}/>{error}</p>}
          <button disabled={loading} className='button primary-button'>{loading ? <><span className="mini-spinner"/>Signing in...</> : <>Sign in <Icon name="arrow" size={17}/></>}</button>
        </form>
          <p className="auth-switch">New to Careerly? <Link to={"/register"}>Create an account</Link></p>
      </div>
      </section>
    </main>
  )
}

export default Login
