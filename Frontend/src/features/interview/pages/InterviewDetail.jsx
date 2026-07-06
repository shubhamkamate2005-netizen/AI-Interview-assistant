import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "../../../style/detail.scss";

const InterviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getReportById } = useInterview();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("technical");
    const [openQuestions, setOpenQuestions] = useState({});

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getReportById(id);
                setReport(data);
            } catch (err) {
                console.error("Failed to load interview report:", err);
                setError("Could not load the interview plan. Please check if it exists.");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const toggleQuestion = (index) => {
        setOpenQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner"></div>
                <h1>Analyzing report data...</h1>
                <p>Loading your personalized strategy plan.</p>
            </main>
        );
    }

    if (error || !report) {
        return (
            <main className="error-screen">
                <div className="error-card">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error || "We couldn't retrieve this interview report."}</p>
                    <button onClick={() => navigate("/")} className="btn-back">
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    // Safety checks for collections
    const technicalQs = report.technicalQuestions || [];
    const behavioralQs = report.behavioralQuestion || report.behavioralQuestions || [];
    const skillGaps = report.skillgaps || report.skillGaps || [];
    const prepPlan = report.preparationPlan || [];

    // Helper for match score class
    const getScoreColorClass = (score) => {
        if (score >= 80) return "score--high";
        if (score >= 60) return "score--mid";
        return "score--low";
    };

    return (
        <div className="detail-page">
            {/* Header Navigation */}
            <nav className="detail-nav">
                <button onClick={() => navigate("/")} className="btn-back-nav">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Dashboard
                </button>
                <div className="nav-title">Interview Planner AI</div>
            </nav>

            {/* Main Layout Grid */}
            <div className="detail-grid">
                
                {/* Left Side: Summary Card & Score */}
                <div className="grid-left">
                    <div className="summary-card">
                        <span className="summary-card__tag">Report Details</span>
                        <h1 className="summary-card__title">{report.title || "Target Position"}</h1>
                        <p className="summary-card__date">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                        
                        {/* Circular Score Meter */}
                        <div className="score-meter-container">
                            <div className={`score-meter-ring ${getScoreColorClass(report.matchScore)}`}>
                                <div className="score-meter-inner">
                                    <span className="score-value">{report.matchScore}%</span>
                                    <span className="score-label">Match Score</span>
                                </div>
                            </div>
                        </div>

                        <div className="score-explanation">
                            {report.matchScore >= 80 ? (
                                <p className="success-text">🎉 Strong Match! Your profile is highly compatible with this role. Focus on polishing behaviorals and specific edge cases.</p>
                            ) : report.matchScore >= 60 ? (
                                <p className="warning-text">⚡ Good potential. You have solid foundations but need to address key skill gaps and align your self-description better with the job requirements.</p>
                            ) : (
                                <p className="danger-text">⚠️ High Skill Gaps. Significant differences found between your profile and the job description. Follow the preparation plan to bridge these gaps.</p>
                            )}
                        </div>
                    </div>

                    {/* Skill Gaps Card */}
                    <div className="gaps-card">
                        <h2>Identified Skill Gaps</h2>
                        {skillGaps.length === 0 ? (
                            <p className="no-gaps-text">No major skill gaps identified! You meet all listed requirements.</p>
                        ) : (
                            <div className="gaps-list">
                                {skillGaps.map((gap, index) => (
                                    <div key={index} className="gap-item">
                                        <span className="gap-name">{gap.skill}</span>
                                        <span className={`severity-badge severity--${gap.severity.toLowerCase()}`}>
                                            {gap.severity} Priority
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Questions Accordion & Prep Plan */}
                <div className="grid-right">
                    
                    {/* Tabs Navigation */}
                    <div className="tabs-header">
                        <button 
                            className={`tab-btn ${activeTab === "technical" ? "active" : ""}`}
                            onClick={() => setActiveTab("technical")}
                        >
                            Technical Questions ({technicalQs.length})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
                            onClick={() => setActiveTab("behavioral")}
                        >
                            Behavioral Questions ({behavioralQs.length})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === "plan" ? "active" : ""}`}
                            onClick={() => setActiveTab("plan")}
                        >
                            Preparation Plan ({prepPlan.length} Days)
                        </button>
                    </div>

                    {/* Tab Content: Questions */}
                    {(activeTab === "technical" || activeTab === "behavioral") && (
                        <div className="questions-tab-content">
                            {activeTab === "technical" && technicalQs.length === 0 && (
                                <p className="empty-tab-text">No technical questions generated.</p>
                            )}
                            {activeTab === "behavioral" && behavioralQs.length === 0 && (
                                <p className="empty-tab-text">No behavioral questions generated.</p>
                            )}

                            <div className="questions-accordion">
                                {(activeTab === "technical" ? technicalQs : behavioralQs).map((q, index) => {
                                    const isOpen = openQuestions[index];
                                    return (
                                        <div key={index} className={`accordion-item ${isOpen ? "open" : ""}`}>
                                            <button className="accordion-toggle" onClick={() => toggleQuestion(index)}>
                                                <span className="q-number">Q{index + 1}</span>
                                                <span className="q-text">{q.question}</span>
                                                <span className="arrow-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                </span>
                                            </button>
                                            
                                            {isOpen && (
                                                <div className="accordion-body">
                                                    <div className="q-section">
                                                        <h4>Interviewer's Intention:</h4>
                                                        <p>{q.intention}</p>
                                                    </div>
                                                    <div className="q-section">
                                                        <h4>How to Answer:</h4>
                                                        <p className="answer-text">{q.answer}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tab Content: Preparation Plan */}
                    {activeTab === "plan" && (
                        <div className="plan-tab-content">
                            {prepPlan.length === 0 ? (
                                <p className="empty-tab-text">No preparation plan generated.</p>
                            ) : (
                                <div className="prep-timeline">
                                    {prepPlan.map((dayPlan, index) => (
                                        <div key={index} className="timeline-day">
                                            <div className="day-badge">Day {dayPlan.day}</div>
                                            <div className="day-content">
                                                <h3>Focus: {dayPlan.focus}</h3>
                                                <ul className="tasks-list">
                                                    {(dayPlan.tasks || []).map((task, tIndex) => (
                                                        <li key={tIndex} className="task-checkbox-item">
                                                            <label className="checkbox-container">
                                                                <input type="checkbox" />
                                                                <span className="checkmark"></span>
                                                                <span className="task-text">{task}</span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>

            {/* Input Summaries Footer Section */}
            <section className="input-summaries">
                <h2>Generated from your Input Data</h2>
                <div className="summaries-grid">
                    <div className="summary-box">
                        <h3>Submitted Job Description</h3>
                        <div className="summary-box__scroll">
                            <p>{report.jobDescription}</p>
                        </div>
                    </div>
                    {report.selfDescription && (
                        <div className="summary-box">
                            <h3>Submitted Self Description</h3>
                            <div className="summary-box__scroll">
                                <p>{report.selfDescription}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default InterviewDetail;
