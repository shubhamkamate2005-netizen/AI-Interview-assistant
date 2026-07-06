import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AppShell from "../../../components/AppShell"
import Icon from "../../../components/Icon"
import { getReportById } from "../services/interview.api"
import { getErrorMessage } from "../../../lib/api"

function ScoreRing({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
  return <div className="score-ring" style={{"--score": `${safeScore * 3.6}deg`}}><div><strong>{safeScore}%</strong><span>role match</span></div></div>
}

export default function ReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tab, setTab] = useState("technical")
  const [openQuestion, setOpenQuestion] = useState(0)
  const [completed, setCompleted] = useState({})

  useEffect(() => {
    let active = true
    getReportById(id).then(data => { if(active) setReport(data.report) }).catch(err => { if(active) setError(getErrorMessage(err, "This report could not be loaded.")) }).finally(() => { if(active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <AppShell title="Your report"><main className="screen-state"><span className="large-spinner"/><h2>Opening your strategy</h2><p>Bringing your personalized recommendations together.</p></main></AppShell>
  if (error || !report) return <AppShell title="Your report"><main className="screen-state error"><span><Icon name="alert"/></span><h2>We couldn’t open this report</h2><p>{error}</p><button className="button secondary-button" onClick={() => navigate("/")}><Icon name="back" size={17}/>Back to dashboard</button></main></AppShell>

  const technical = report.technicalQuestions || []
  const behavioral = report.behavioralQuestions || report.behavioralQuestion || []
  const gaps = report.skillGaps || report.skillgaps || []
  const plan = report.preparationPlan || []
  const questions = tab === "technical" ? technical : behavioral
  const score = Number(report.matchScore) || 0
  const scoreMessage = score >= 80 ? "Excellent alignment. Focus on confidence and evidence." : score >= 60 ? "A promising fit with a few high-value gaps to close." : "A stretch role—use the plan to close the most important gaps first."

  return <AppShell title="Interview strategy">
    <main className="report-page">
      <button className="back-link" onClick={() => navigate("/")}><Icon name="back" size={17}/>Back to dashboard</button>
      <section className="report-hero">
        <div className="report-heading"><span className="eyebrow"><Icon name="sparkles" size={14}/>Personalized career analysis</span><h2>{report.title || "Target opportunity"}</h2><p>Generated {new Date(report.createdAt).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}</p></div>
        <div className="score-summary"><ScoreRing score={score}/><div><span>Overall compatibility</span><strong>{score >= 80 ? "Strong match" : score >= 60 ? "Good potential" : "Growth opportunity"}</strong><p>{scoreMessage}</p></div></div>
      </section>

      <div className="report-layout">
        <aside className="report-aside">
          <section className="insight-card"><div className="insight-title"><span><Icon name="target"/></span><div><h3>Priority skill gaps</h3><p>What to sharpen first</p></div></div>
            {gaps.length ? <div className="gap-list">{gaps.map((gap,index) => <div className="gap-row" key={`${gap.skill}-${index}`}><span>{gap.skill}</span><small className={`severity-${String(gap.severity).toLowerCase()}`}>{gap.severity}</small></div>)}</div> : <div className="all-clear"><Icon name="check"/><p>No major skill gaps found.</p></div>}
          </section>
          <section className="source-card"><h3>Analysis source</h3><div><Icon name="briefcase"/><span><strong>Job description</strong><small>{report.jobDescription?.slice(0,105)}{report.jobDescription?.length > 105 ? "…" : ""}</small></span></div>{report.selfDescription && <div><Icon name="user"/><span><strong>Your profile</strong><small>{report.selfDescription.slice(0,105)}{report.selfDescription.length > 105 ? "…" : ""}</small></span></div>}</section>
        </aside>

        <section className="strategy-card">
          <div className="tabs" role="tablist"><button className={tab === "technical" ? "active" : ""} onClick={() => {setTab("technical");setOpenQuestion(0)}}>Technical <span>{technical.length}</span></button><button className={tab === "behavioral" ? "active" : ""} onClick={() => {setTab("behavioral");setOpenQuestion(0)}}>Behavioral <span>{behavioral.length}</span></button><button className={tab === "plan" ? "active" : ""} onClick={() => setTab("plan")}>Action plan <span>{plan.length}</span></button></div>
          {tab !== "plan" ? <div className="question-list">
            <div className="content-intro"><div><h3>{tab === "technical" ? "Technical interview questions" : "Behavioral interview questions"}</h3><p>Open each question to understand what the interviewer is looking for.</p></div></div>
            {questions.length ? questions.map((item,index) => <article className={`question-item ${openQuestion === index ? "open" : ""}`} key={`${item.question}-${index}`}><button onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)}><span className="question-number">{String(index + 1).padStart(2,"0")}</span><strong>{item.question}</strong><Icon name="chevron"/></button>{openQuestion === index && <div className="question-answer"><div><span>Why they ask</span><p>{item.intention}</p></div><div className="answer-coach"><span><Icon name="sparkles" size={14}/>How to answer</span><p>{item.answer}</p></div></div>}</article>) : <div className="empty-state compact"><p>No questions were generated for this section.</p></div>}
          </div> : <div className="plan-content"><div className="content-intro"><div><h3>Your focused preparation plan</h3><p>Small, deliberate steps designed around this exact opportunity.</p></div><span className="progress-label">{Object.values(completed).filter(Boolean).length} tasks done</span></div>
            <div className="timeline">{plan.length ? plan.map((day,index) => <article className="plan-day" key={`${day.day}-${index}`}><div className="timeline-marker"><span>{day.day}</span></div><div className="day-card"><span className="day-label">Day {day.day}</span><h3>{day.focus}</h3><ul>{(day.tasks || []).map((task,taskIndex) => {const key=`${index}-${taskIndex}`; return <li key={key}><label><input type="checkbox" checked={Boolean(completed[key])} onChange={() => setCompleted(current => ({...current,[key]:!current[key]}))}/><span className="custom-check"><Icon name="check" size={13}/></span><span>{task}</span></label></li>})}</ul></div></article>) : <div className="empty-state compact"><p>No preparation steps were generated.</p></div>}</div>
          </div>}
        </section>
      </div>
    </main>
  </AppShell>
}
