import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Announcement,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getManagedAnnouncements,
  setAnnouncementPublished,
} from '../services/api';
import './InformationCenterPage.css';

type Category = 'ALL' | 'ACADEMIC' | 'EXAMINATION' | 'UNIVERSITY' | 'SPORTS' | 'ELECTION';

const categories: { key: Category; label: string; icon: string }[] = [
  { key: 'ALL', label: 'All updates', icon: 'fas fa-layer-group' },
  { key: 'ACADEMIC', label: 'Academic', icon: 'fas fa-graduation-cap' },
  { key: 'EXAMINATION', label: 'Examinations', icon: 'fas fa-file-alt' },
  { key: 'UNIVERSITY', label: 'University', icon: 'fas fa-university' },
  { key: 'SPORTS', label: 'Sports', icon: 'fas fa-running' },
  { key: 'ELECTION', label: 'Elections', icon: 'fas fa-vote-yea' },
];

const emptyDraft = {
  title: '', content: '', category: 'UNIVERSITY', priority: 'NORMAL', attachmentUrl: '',
  targetYear: '', targetProgramme: '', targetCourse: '', publishAt: '', expiresAt: '', published: true,
};

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Now';
}

export default function InformationCenterPage() {
  const isStaff = ['ADMIN', 'ACADEMIC_OFFICER', 'SPORTS_OFFICER'].includes(localStorage.getItem('role') ?? '');
  const [items, setItems] = useState<Announcement[]>([]);
  const [category, setCategory] = useState<Category>('ALL');
  const [draft, setDraft] = useState(emptyDraft);
  const [showComposer, setShowComposer] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setItems(isStaff ? await getManagedAnnouncements() : await getAnnouncements());
    } catch {
      setError('Information could not be loaded. Please check your connection and try again.');
    }
  };

  useEffect(() => { load(); }, []);

  const filteredItems = useMemo(() => category === 'ALL' ? items : items.filter((item) => item.category === category), [category, items]);
  const urgentCount = items.filter((item) => item.priority === 'URGENT').length;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createAnnouncement({ ...draft, publishAt: draft.publishAt || undefined, expiresAt: draft.expiresAt || undefined });
      setDraft(emptyDraft);
      setShowComposer(false);
      setNotice('Information published successfully.');
      await load();
    } catch {
      setError('The announcement could not be published. Check the required fields and dates.');
    }
  };

  const togglePublished = async (item: Announcement) => {
    try {
      await setAnnouncementPublished(item.id, !item.published);
      await load();
    } catch { setError('Publication status could not be changed.'); }
  };

  const remove = async (item: Announcement) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try { await deleteAnnouncement(item.id); await load(); } catch { setError('The announcement could not be deleted.'); }
  };

  return (
    <div className="information-page">
      <header className="information-hero">
        <div>
          <p className="information-kicker">AMIS / University Information Center</p>
          <h1>Stay in the know.</h1>
          <p>Academic updates, examination notices, campus events, sports fixtures, and student leadership information in one place.</p>
        </div>
        <div className="information-hero-mark"><i className="fas fa-bullhorn" /></div>
      </header>

      {notice && <div className="information-notice information-notice-success">{notice}</div>}
      {error && <div className="information-notice information-notice-error">{error}</div>}

      <div className="information-toolbar">
        <div className="information-tabs" role="tablist">
          {categories.map((item) => <button key={item.key} className={category === item.key ? 'information-tab active' : 'information-tab'} onClick={() => setCategory(item.key)}><i className={item.icon} /> {item.label}</button>)}
        </div>
        <div className="information-summary"><strong>{items.length}</strong> updates {urgentCount > 0 && <span><i className="fas fa-exclamation-circle" /> {urgentCount} urgent</span>}</div>
      </div>

      {isStaff && <button className="information-compose-button" onClick={() => setShowComposer(!showComposer)}><i className="fas fa-plus" /> {showComposer ? 'Close composer' : 'Publish information'}</button>}
      {isStaff && showComposer && <form className="information-composer" onSubmit={submit}>
        <div className="composer-heading"><div className="information-kicker">Staff publishing</div><h2>Publish an update</h2></div>
        <div className="composer-grid">
          <input required placeholder="Headline" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.slice(1).map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
          <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}><option value="NORMAL">Normal priority</option><option value="IMPORTANT">Important</option><option value="URGENT">Urgent notice</option></select>
          <textarea required placeholder="Write the announcement or information here..." value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} />
          <input placeholder="Attachment URL (optional)" value={draft.attachmentUrl} onChange={(event) => setDraft({ ...draft, attachmentUrl: event.target.value })} />
          <input placeholder="Target programme (optional)" value={draft.targetProgramme} onChange={(event) => setDraft({ ...draft, targetProgramme: event.target.value })} />
          <input placeholder="Target year (optional)" value={draft.targetYear} onChange={(event) => setDraft({ ...draft, targetYear: event.target.value })} />
          <label>Publish at <input type="datetime-local" value={draft.publishAt} onChange={(event) => setDraft({ ...draft, publishAt: event.target.value })} /></label>
          <label>Expires at <input type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft({ ...draft, expiresAt: event.target.value })} /></label>
        </div>
        <button className="information-primary-button">Publish update</button>
      </form>}

      <main className="information-feed">
        {filteredItems.length === 0 ? <div className="information-empty"><i className="fas fa-inbox" /><h2>No updates in this section</h2><p>Published information will appear here for students.</p></div> : filteredItems.map((item) => <article className={`information-item priority-${item.priority.toLowerCase()}`} key={item.id}>
          <div className="information-item-icon"><i className={categories.find((entry) => entry.key === item.category)?.icon ?? 'fas fa-info'} /></div>
          <div className="information-item-body"><div className="information-item-meta"><span>{item.category}</span><time>{formatDate(item.publishAt)}</time>{item.priority !== 'NORMAL' && <b>{item.priority}</b>}</div><h2>{item.title}</h2><p>{item.content}</p>{(item.targetProgramme || item.targetYear || item.targetCourse) && <small className="audience-note">For {item.targetProgramme || 'students'}{item.targetYear ? ` / Year ${item.targetYear}` : ''}{item.targetCourse ? ` / ${item.targetCourse}` : ''}</small>}{item.attachmentUrl && <a className="attachment-link" href={item.attachmentUrl} target="_blank" rel="noreferrer"><i className="fas fa-paperclip" /> View attachment</a>}</div>
          {isStaff && <div className="information-item-actions"><button onClick={() => togglePublished(item)}>{item.published ? 'Unpublish' : 'Publish'}</button>{localStorage.getItem('role') === 'ADMIN' && <button onClick={() => remove(item)}>Delete</button>}</div>}
        </article>)}
      </main>
    </div>
  );
}
