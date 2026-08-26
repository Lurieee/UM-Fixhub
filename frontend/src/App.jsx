import { useMemo, useState } from 'react'
import './App.css'

const reports = [
  ['🪑', 'Broken Desk Chair', 'Furniture repair request for study area.', 'Library Room 302', 'Oct 22, 2024', 'progress'],
  ['💧', 'Leaky Water Fountain', 'Water pooling near the main entrance.', 'Student Union', 'Oct 18, 2024', 'resolved'],
  ['💡', 'Light Out in Hallway', 'Hazardous dark area near lab entrance.', 'Science Block B', 'Oct 24, 2024', 'submitted'],
  ['📣', 'Elevator Stuck (DPT)', 'Floor display flickering and doors jamming.', 'DPT Building', 'Oct 21, 2024', 'progress'],
  ['❄️', 'AC Unit Making Noise', 'Loud grinding sound in Lecture Hall A.', 'West Wing', 'Oct 15, 2024', 'resolved'],
]

const status = { progress: 'In Progress', resolved: 'Resolved', submitted: 'Submitted' }

function Header({ page, setPage }) {
  const links = [['home', '⌂', 'Home'], ['report', '⊕', 'Report Issue'], ['reports', '▤', 'My Reports']]
  return <header><div className="nav"><button className="brand" onClick={() => setPage('home')}><b>⌂</b><strong>UM Fixhub</strong></button><nav>{links.map(([key, icon, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><span>{icon}</span>{label}</button>)}</nav><div className="profile"><i>♧</i><div><b>Hi, Lorena!</b><small>Student Account</small></div><em>AS</em></div></div></header>
}

function ReportRow({ report, compact }) {
  return <article className={compact ? 'report-row compact' : 'report-row'}><span className="issue-icon">{report[0]}</span><div className="issue"><b>{report[1]}</b><small>{compact ? `● ${report[3]}` : report[2]}</small></div>{!compact && <><span className="location">⌖ {report[3]}</span><time>{report[4]}</time></>}<span className={`badge ${report[5]}`}>{status[report[5]]}</span><span className="more">{compact ? '›' : '⋮'}</span></article>
}

function Home({ setPage }) {
  return <div className="home grid"><div><section className="hero"><div><h1>Spot a campus issue?</h1><p>Help us keep campus safe and fully functional. Let our maintenance team know what needs fixing across the university facilities.</p><button onClick={() => setPage('report')}>＋ Report New Issue</button></div><span>🔧</span></section><div className="section-title"><h2>Your Recent Reports</h2><button onClick={() => setPage('reports')}>View All Reports</button></div><div className="recent">{reports.slice(0, 3).map((r) => <ReportRow key={r[1]} report={r} compact />)}</div></div><aside><section className="panel"><h2>Campus Updates</h2><div className="update highlight"><span>📣</span><p><b>DPT Building Elevator Maintenance</b><small>Out of service on Oct 24th from 8:00 AM to noon.</small></p></div><div className="update"><span>💧</span><p><b>Water Main Repairs - North Dorms</b><small>Scheduled for tomorrow. Temporary outages expected between 2-4 PM.</small></p></div><button className="outline">View All Alerts</button></section><section className="panel activity"><h2>Your Activity</h2><div><p><b>12</b><small>Total Fixed</small></p><p><b>3</b><small>Active</small></p></div><label>Campus Safety Score <b>94%</b><i><span /></i></label></section><section className="emergency"><h3>Need immediate help?</h3><p>For urgent security issues or building emergencies.</p><button>Contact Emergency Services</button></section></aside></div>
}

function Reports({ setPage }) {
  const [filter, setFilter] = useState('all'); const [query, setQuery] = useState('')
  const filtered = useMemo(() => reports.filter((r) => (filter === 'all' || r[5] === filter) && r[1].toLowerCase().includes(query.toLowerCase())), [filter, query])
  return <section className="reports-page"><div className="page-heading"><div><h1>My Submitted Reports</h1><p>Track and manage all your campus maintenance requests.</p></div><button onClick={() => setPage('report')}>＋ New Report</button></div><div className="toolbar"><div>{[['all', 'All Reports'], ['progress', 'In Progress'], ['resolved', 'Resolved'], ['submitted', 'Drafts']].map(([key, label]) => <button key={key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div><label>⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports..." /></label><b>⇵ Sort: Newest</b></div><div className="columns"><span>Issue Details</span><span>Location</span><span>Date Submitted</span><span>Status</span></div><div className="report-list">{filtered.map((r) => <ReportRow key={r[1]} report={r} />)}</div><footer className="pagination">Showing <b>{filtered.length}</b> of <b>{reports.length}</b> reports <span><button>‹</button><button className="current">1</button><button>2</button><button>3</button><button>›</button></span></footer></section>
}

function ReportForm({ setPage }) {
  const [urgency, setUrgency] = useState('Medium'); const [sent, setSent] = useState(false)
  return <section className="form-card"><div className="form-title"><button onClick={() => setPage('home')}>‹</button><h1>Report Issue</h1></div><div className="category"><span>🪑</span><p><small>Issue Category</small><b>Furniture</b></p><button>Change</button></div><form onSubmit={(e) => { e.preventDefault(); setSent(true) }}><div className="form-grid"><label>Where is the issue?<input required placeholder="▥  PS Building" /></label><label>Room No.<input placeholder="302" /></label></div><label>Add a Photo<span className="upload">▣<b>Take photo or upload</b><small>Drag and drop or click to browse (JPEG, PNG up to 10MB)</small></span></label><label>Describe the issue<textarea required placeholder="Describe the problem so our maintenance team can help." /></label><label>Urgency Level<span className="urgency">{['Low', 'Medium', 'High'].map((level) => <button type="button" key={level} onClick={() => setUrgency(level)} className={urgency === level ? 'chosen' : ''}>{level}</button>)}</span></label><button className="submit">➤ Submit Report</button>{sent && <p className="success">Your report has been submitted.</p>}</form></section>
}

function App() { const [page, setPage] = useState('home'); return <><Header page={page} setPage={setPage} /><main>{page === 'home' && <Home setPage={setPage} />}{page === 'reports' && <Reports setPage={setPage} />}{page === 'report' && <ReportForm setPage={setPage} />}</main><footer className="site-footer">© 2024 University Maintenance Fixhub. All rights reserved.<span>Privacy Policy　 Terms of Service　 Admin Login</span></footer></> }
export default App
