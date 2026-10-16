import { FormEvent, useEffect, useState } from 'react';
import {
  addElectionCandidate,
  addElectionPosition,
  assetUrl,
  castElectionVote,
  createElection,
  Election,
  ElectionResult,
  getElectionResults,
  getElections,
  updateElectionStatus,
  uploadCandidatePhoto,
} from '../services/api';
import PieChart from '../components/PieChart';
import './ElectionPage.css';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function isVotingOpen(election: Election) {
  const now = Date.now();
  return election.active && !election.closed && now >= new Date(election.startsAt).getTime() && now <= new Date(election.endsAt).getTime();
}

function ElectionPage() {
  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const [elections, setElections] = useState<Election[]>([]);
  const [results, setResults] = useState<Record<number, ElectionResult>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newElection, setNewElection] = useState({ title: '', description: '', startsAt: '', endsAt: '' });

  const loadElections = async () => {
    setLoading(true);
    try {
      setElections(await getElections());
    } catch {
      setError('Unable to load elections. Please sign in again and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  // Keep the live tally current for everyone viewing this page.  Polling is
  // deliberately lightweight and also makes the count update immediately
  // after a student casts a vote without requiring a page refresh.
  useEffect(() => {
    if (elections.length === 0) return;

    const refreshResults = () => {
      elections.forEach((election) => {
        getElectionResults(election.id)
          .then((result) => setResults((current) => ({ ...current, [election.id]: result })))
          .catch(() => undefined);
      });
    };

    refreshResults();
    const timer = window.setInterval(refreshResults, 10000);
    return () => window.clearInterval(timer);
  }, [elections]);

  const handleCreateElection = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createElection(newElection);
      setNewElection({ title: '', description: '', startsAt: '', endsAt: '' });
      setMessage('Election created. Add positions and candidates before activating it.');
      await loadElections();
    } catch {
      setError('Election could not be created. Check the dates and required fields.');
    }
  };

  const handleVote = async (electionId: number, positionId: number) => {
    const candidateId = selectedCandidates[positionId];
    if (!candidateId) return;
    setError('');
    try {
      await castElectionVote(electionId, candidateId);
      setMessage('Your vote was recorded securely. You cannot vote again for this position.');
      await loadElections();
      await loadResults(electionId);
    } catch {
      setError('Your vote was not submitted. The position may already have a recorded vote or the election may be closed.');
    }
  };

  const loadResults = async (electionId: number) => {
    try {
      const result = await getElectionResults(electionId);
      setResults((current) => ({ ...current, [electionId]: result }));
    } catch {
      setError('Results are not available right now.');
    }
  };

  return (
    <div className="election-page">
      <div className="election-heading">
        <div>
          <p className="eyebrow">AMIS / Student Governance</p>
          <h1>Student Elections</h1>
          <p>Choose one candidate for each leadership position. Your ballot is recorded once and cannot be changed.</p>
        </div>
        <div className="election-shield"><i className="fas fa-check-double" /></div>
      </div>

      {message && <div className="election-alert election-alert-success">{message}</div>}
      {error && <div className="election-alert election-alert-error">{error}</div>}

      {isAdmin && (
        <section className="election-admin-create">
          <div className="section-label">Administrator controls</div>
          <h2>Create an election</h2>
          <form className="election-create-form" onSubmit={handleCreateElection}>
            <input required placeholder="Election title" value={newElection.title} onChange={(event) => setNewElection({ ...newElection, title: event.target.value })} />
            <input placeholder="Short description" value={newElection.description} onChange={(event) => setNewElection({ ...newElection, description: event.target.value })} />
            <label>Starts <input required type="datetime-local" value={newElection.startsAt} onChange={(event) => setNewElection({ ...newElection, startsAt: event.target.value })} /></label>
            <label>Ends <input required type="datetime-local" value={newElection.endsAt} onChange={(event) => setNewElection({ ...newElection, endsAt: event.target.value })} /></label>
            <button className="election-button election-button-primary">Create election</button>
          </form>
        </section>
      )}

      {loading ? <div className="election-empty">Loading elections...</div> : elections.length === 0 ? (
        <div className="election-empty"><i className="fas fa-calendar-day" /><h2>No elections published</h2><p>When an election is scheduled, it will appear here.</p></div>
      ) : elections.map((election) => (
        <ElectionCard
          key={election.id}
          election={election}
          isAdmin={isAdmin}
          result={results[election.id]}
          selectedCandidates={selectedCandidates}
          onSelect={(positionId, candidateId) => setSelectedCandidates({ ...selectedCandidates, [positionId]: candidateId })}
          onVote={handleVote}
          onResults={loadResults}
          onRefresh={loadElections}
          onMessage={setMessage}
          onError={setError}
        />
      ))}
    </div>
  );
}

interface ElectionCardProps {
  election: Election;
  isAdmin: boolean;
  result?: ElectionResult;
  selectedCandidates: Record<number, number>;
  onSelect: (positionId: number, candidateId: number) => void;
  onVote: (electionId: number, positionId: number) => void;
  onResults: (electionId: number) => void;
  onRefresh: () => Promise<void>;
  onMessage: (message: string) => void;
  onError: (message: string) => void;
}

function ElectionCard({ election, isAdmin, result, selectedCandidates, onSelect, onVote, onResults, onRefresh, onMessage, onError }: ElectionCardProps) {
  const open = isVotingOpen(election);
  const [positionName, setPositionName] = useState('');
  const [candidateDraft, setCandidateDraft] = useState<Record<number, { name: string; manifesto: string; photo?: File }>>({});

  const addPosition = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await addElectionPosition(election.id, { name: positionName, displayOrder: election.positions.length + 1 });
      setPositionName('');
      onMessage('Leadership position added.');
      await onRefresh();
    } catch {
      onError('Position could not be added.');
    }
  };

  const addCandidate = async (event: FormEvent, positionId: number) => {
    event.preventDefault();
    const draft = candidateDraft[positionId] ?? { name: '', manifesto: '' };
    try {
      const candidate = await addElectionCandidate(positionId, { name: draft.name, manifesto: draft.manifesto });
      if (draft.photo) {
        await uploadCandidatePhoto(candidate.id, draft.photo);
      }
      setCandidateDraft({ ...candidateDraft, [positionId]: { name: '', manifesto: '' } });
      onMessage(draft.photo ? 'Candidate added with photo.' : 'Candidate added.');
      await onRefresh();
    } catch {
      onError('Candidate could not be added.');
    }
  };

  const changeStatus = async (active: boolean, closed: boolean) => {
    try {
      await updateElectionStatus(election.id, { active, closed });
      onMessage(closed ? 'Election closed. Results are now final.' : 'Election status updated.');
      await onRefresh();
    } catch {
      onError('Election status could not be updated.');
    }
  };

  return (
    <article className="election-card">
      <div className="election-card-header">
        <div>
          <div className="election-status"><span className={`status-dot ${open ? 'status-dot-open' : ''}`} /> {election.closed ? 'Closed' : election.active ? 'Active' : 'Draft'}</div>
          <h2>{election.title}</h2>
          <p>{election.description || 'Student leadership election'}</p>
        </div>
        <div className="election-dates"><strong>{formatDate(election.startsAt)}</strong><span>to</span><strong>{formatDate(election.endsAt)}</strong></div>
      </div>

      {isAdmin && (
        <div className="admin-toolbar">
          <button className="election-button election-button-primary" disabled={election.closed} onClick={() => changeStatus(true, false)}>Activate election</button>
          <button className="election-button election-button-danger" disabled={election.closed} onClick={() => changeStatus(false, true)}>Close and publish winner</button>
        </div>
      )}

      <div className="positions-grid">
        {election.positions.map((position) => (
          <section className="position-card" key={position.id}>
            <div className="position-heading"><span>{String(position.displayOrder).padStart(2, '0')}</span><div><h3>{position.name}</h3><small>{position.voted ? 'Vote recorded' : 'Select one candidate'}</small></div></div>
            <div className="candidate-list">
              {position.candidates.map((candidate) => (
                <label className={`candidate-option ${selectedCandidates[position.id] === candidate.id ? 'candidate-selected' : ''}`} key={candidate.id}>
                  <input type="radio" name={`position-${position.id}`} disabled={!open || position.voted} checked={selectedCandidates[position.id] === candidate.id} onChange={() => onSelect(position.id, candidate.id)} />
                  {candidate.photoUrl
                    ? <img className="candidate-photo" src={assetUrl(candidate.photoUrl)} alt={candidate.name} />
                    : <span className="candidate-photo candidate-photo-placeholder"><i className="fas fa-user" /></span>}
                  <span><strong>{candidate.name}</strong><small>{candidate.manifesto || 'No manifesto provided.'}</small></span>
                </label>
              ))}
            </div>
            {!isAdmin && <button className="election-button election-button-primary vote-button" disabled={!open || position.voted || !selectedCandidates[position.id]} onClick={() => onVote(election.id, position.id)}>{position.voted ? 'Vote recorded' : 'Submit vote'}</button>}
            {isAdmin && !election.closed && (
              <form className="candidate-form" onSubmit={(event) => addCandidate(event, position.id)}>
                <input required placeholder="Candidate name" value={candidateDraft[position.id]?.name ?? ''} onChange={(event) => setCandidateDraft({ ...candidateDraft, [position.id]: { ...(candidateDraft[position.id] ?? { manifesto: '' }), name: event.target.value } })} />
                <input placeholder="Manifesto (optional)" value={candidateDraft[position.id]?.manifesto ?? ''} onChange={(event) => setCandidateDraft({ ...candidateDraft, [position.id]: { ...(candidateDraft[position.id] ?? { name: '' }), manifesto: event.target.value } })} />
                <label className="candidate-photo-input">
                  <i className="fas fa-camera" /> {candidateDraft[position.id]?.photo ? candidateDraft[position.id].photo!.name : 'Attach photo (optional)'}
                  <input type="file" accept="image/*" key={candidateDraft[position.id]?.photo?.name ?? 'empty'} onChange={(event) => setCandidateDraft({ ...candidateDraft, [position.id]: { ...(candidateDraft[position.id] ?? { name: '', manifesto: '' }), photo: event.target.files?.[0] } })} />
                </label>
                <button className="election-button election-button-secondary">Add candidate</button>
              </form>
            )}
          </section>
        ))}
      </div>

      {isAdmin && !election.closed && <form className="position-form" onSubmit={addPosition}><input required placeholder="New leadership position" value={positionName} onChange={(event) => setPositionName(event.target.value)} /><button className="election-button election-button-secondary">Add position</button></form>}
      <div className="results-footer"><button className="results-link" onClick={() => onResults(election.id)}><i className="fas fa-chart-bar" /> {election.closed ? 'Refresh final results' : 'Refresh live results'}</button><small>Results refresh automatically every 10 seconds.</small></div>
      {result && <ResultsPanel result={result} final={election.closed} />}
    </article>
  );
}

function ResultsPanel({ result, final }: { result: ElectionResult; final: boolean }) {
  return (
    <section className="results-panel">
      <div className="section-label">{final ? 'Official result' : 'Live count'}</div>
      <h3>{final ? 'Final winners' : 'Current results'}</h3>
      {result.positions.map((position) => (
        <div className="result-row" key={position.position}>
          <div className="result-row-heading"><strong>{position.position}</strong><span>{position.totalVotes} votes</span></div>
          <PieChart data={position.candidates.map((candidate) => ({ label: candidate.name, value: candidate.votes }))} />
          {position.candidates.map((candidate) => (
            <div className="result-candidate" key={candidate.id}>
              <div className="result-candidate-name"><span>{candidate.name}</span><div className="result-progress"><i style={{ width: `${candidate.percentage}%` }} /></div></div>
              <span>{candidate.votes} <em>{candidate.percentage.toFixed(1)}%</em></span>
            </div>
          ))}
          {position.winner && (
            <div className="winner-card">
              {position.winner.photoUrl
                ? <img className="winner-photo" src={assetUrl(position.winner.photoUrl)} alt={position.winner.name} />
                : <span className="winner-photo winner-photo-placeholder"><i className="fas fa-trophy" /></span>}
              <div className="winner-card-body">
                <p className="winner-line"><i className="fas fa-trophy" /> {final ? 'Winner' : 'Leading'}: {position.winner.name} — {position.winner.percentage.toFixed(1)}%</p>
                <small>{position.winner.votes} of {position.totalVotes} votes</small>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export default ElectionPage;
