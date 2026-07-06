import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppShell from "../../../components/AppShell"
import Icon from "../../../components/Icon"
import { useInterview } from "../hooks/useInterview"
import { getErrorMessage } from "../../../lib/api"

export default function Dashboard() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { reports, generateReport, generating, reportsLoading } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  const chooseFile = (file) => {
    if (!file) return
    if (file.type !== "application/pdf") return setError("Please upload your resume as a PDF file.")
    if (file.size > 5 * 1024 * 1024) return setError("Your PDF must be smaller than 5MB.")
    setResumeFile(file)
    setError("")
  }

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    if (!jobDescription.trim()) return setError("Add the job description you want to target.")
    if (!resumeFile && !selfDescription.trim()) return setError("Upload your resume or add a short profile summary.")
    try {
      const report = await generateReport({ jobDescription, selfDescription, resumeFile })
      navigate(`/interview/${report._id}`)
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't create your analysis. Please try again."))
    }
  }

  return <AppShell>
    <main className="dashboard-content">
      <section className="welcome-row">
        <div><span className="eyebrow"><Icon name="sparkles" size={14}/>AI-powered preparation</span><h2>Build your interview advantage.</h2><p>Share the role and your experience. Careerly turns both into a practical, personalized game plan.</p></div>
        <div className="trust-pill"><span className="trust-icon"><Icon name="target"/></span><div><strong>{reports.length}</strong><small>career {reports.length === 1 ? "plan" : "plans"} created</small></div></div>
      </section>

      <form id="new-analysis" className="analysis-card" onSubmit={submit}>
        <div className="card-title"><span className="step-number">01</span><div><h3>Tell us about the opportunity</h3><p>Paste the complete listing for the most accurate analysis.</p></div><span className="required-pill">Required</span></div>
        <label className="field-label" htmlFor="jobDescription">Job description</label>
        <div className="textarea-wrap"><textarea id="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} maxLength="8000" placeholder="Paste the responsibilities, requirements, and qualifications here..."/><span>{jobDescription.length.toLocaleString()} / 8,000</span></div>

        <div className="section-divider"><span>02</span><div><h3>Add your experience</h3><p>A resume gives the AI the richest context, but a summary works too.</p></div></div>
        <div className="profile-grid">
          <div><label className="field-label">Resume <span>Recommended</span></label>
            <div className={`dropzone ${dragging ? "is-dragging" : ""} ${resumeFile ? "has-file" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={e => {e.preventDefault(); setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files[0])}} role="button" tabIndex="0" onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={e => chooseFile(e.target.files[0])}/>
              <span className="upload-icon"><Icon name={resumeFile ? "check" : "upload"}/></span>
              {resumeFile ? <><strong>{resumeFile.name}</strong><small>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</small><button type="button" onClick={e => {e.stopPropagation(); setResumeFile(null); if(inputRef.current) inputRef.current.value=""}}>Remove file</button></> : <><strong>Drop your resume here</strong><small>or click to browse · PDF up to 5MB</small></>}
            </div>
          </div>
          <div className="or-column"><span>or</span></div>
          <div><label className="field-label" htmlFor="selfDescription">Quick profile summary <span>Optional</span></label><textarea className="profile-textarea" id="selfDescription" value={selfDescription} onChange={e => setSelfDescription(e.target.value)} placeholder="Example: Frontend developer with 3 years of experience in React, JavaScript, and REST APIs..."/></div>
        </div>

        {error && <p className="form-error wide" role="alert"><Icon name="alert" size={17}/>{error}</p>}
        <div className="analysis-footer"><p><Icon name="clock" size={17}/>Your analysis usually takes 20–40 seconds.</p><button className="button primary-button generate-button" disabled={generating}>{generating ? <><span className="mini-spinner"/>Building your strategy...</> : <><Icon name="sparkles" size={17}/>Generate my strategy<Icon name="arrow" size={17}/></>}</button></div>
      </form>

      <section id="reports" className="reports-section">
        <div className="section-heading"><div><span className="eyebrow">Your workspace</span><h2>Recent career plans</h2></div><span className="report-count">{reports.length} total</span></div>
        {reportsLoading ? <div className="reports-loading"><span className="mini-spinner"/>Loading your reports...</div> : reports.length ? <div className="report-grid">{reports.map(report => {
          const score = Number(report.matchScore) || 0
          return <button className="report-card" key={report._id} onClick={() => navigate(`/interview/${report._id}`)}>
            <div className="report-card-top"><span className="report-icon"><Icon name="briefcase"/></span><span className={`score-badge score-${score >= 80 ? "high" : score >= 60 ? "mid" : "low"}`}>{score}% match</span></div>
            <div><h3>{report.title || "Untitled opportunity"}</h3><p>Created {new Date(report.createdAt).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</p></div>
            <span className="view-link">View preparation plan <Icon name="arrow" size={16}/></span>
          </button>
        })}</div> : <div className="empty-state"><span><Icon name="file"/></span><h3>Your plans will live here</h3><p>Create your first analysis above and we’ll save it for you.</p></div>}
      </section>
    </main>
  </AppShell>
}
