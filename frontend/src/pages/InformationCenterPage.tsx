import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Announcement,
  assetUrl,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getManagedAnnouncements,
  setAnnouncementPublished,
  uploadAnnouncementAttachment,
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
  title: '', content: '', category: 'UNIVERSITY', priority: 'NORMAL',
  targetYear: '', targetProgramme: '', targetCourse: '', publishAt: '', expiresAt: '', published: true,
};

const acceptTypes = '.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip';
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Now';
}

function attachmentHref(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function AttachmentViewer({ item }: { item: Announcement }) {
  const url = item.attachmentUrl ?? '';
  const fileSrc = url.startsWith('/uploads/') ? url : assetUrl(url);
  return (
    <div className="attachment-viewer">
      <div className="attachment-message">
        <h4>{item.title}</h4>
        <p>{item.content}</p>
        {item.authorUsername && <small>Imetumwa na: {item.authorUsername}</small>}
      </div>
      {!url ? <p className="attachment-empty">Hakuna faili iliyowekwa kwenye taarifa hii.</p> :
        url.startsWith('/uploads/') ? (() => {
          const extension = url.split('.').pop()?.toLowerCase() ?? '';
          if (imageExtensions.includes(extension)) return <img src={fileSrc} alt="Attachment preview" />;
          if (extension === 'pdf') return <iframe src={fileSrc} title="Attachment preview" />;
          return (
            <div className="attachment-download">
              <i className="fas fa-file-download" />
              <a href={fileSrc} download>Download attachment</a>
            </div>
          );
        })() : (
          <div className="attachment-external">
            <p>External link — it opens outside AMIS.</p>
            <a className="attachment-link" href={attachmentHref(url)} target="_blank" rel="noreferrer">Open external link <i className="fas fa-external-link-alt" /></a>
          </div>
        )}
    </div>
  );
}

export default function InformationCenterPage() {
  const isStaff = ['ADMIN', 'ACADEMIC_OFFICER', 'SPORTS_OFFICER'].includes(localStorage.getItem('role') ?? '');
  const [items, setItems] = useState<Announcement[]>([]);
  const [category, setCategory] = useState<Category>('ALL');
  const [draft, setDraft] = useState(emptyDraft);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [openAttachment, setOpenAttachment] = useState<number | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const created = await createAnnouncement({ ...draft, publishAt: draft.publishAt || undefined, expiresAt: draft.expiresAt || undefined });
      if (attachmentFile) await uploadAnnouncementAttachment(created.id, attachmentFile);
      setDraft(emptyDraft);
      setAttachmentFile(null);
      setShowComposer(false);
      setNotice('Information published successfully. Students can now see it in their Student Center.');
      await load();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setError(detail ? `Publishing failed: ${detail}` : 'Publishing failed — check your connection and try again.');
    } finally {
      setSaving(false);
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
          <label className="composer-file">Attach file (optional — opens inside the dashboard){attachmentFile && <b className="composer-file-name">{attachmentFile.name}</b>}
            <input type="file" accept={acceptTypes} onChange={(event) => setAttachmentFile(event.target.files?.[0] ?? null)} />
          </label>
          <input placeholder="Target programme (optional)" value={draft.targetProgramme} onChange={(event) => setDraft({ ...draft, targetProgramme: event.target.value })} />
          <input placeholder="Target year (optional)" value={draft.targetYear} onChange={(event) => setDraft({ ...draft, targetYear: event.target.value })} />
          <input placeholder="Target course (optional)" value={draft.targetCourse} onChange={(event) => setDraft({ ...draft, targetCourse: event.target.value })} />
          <label>Publish at <input type="datetime-local" value={draft.publishAt} onChange={(event) => setDraft({ ...draft, publishAt: event.target.value })} /></label>
          <label>Expires at <input type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft({ ...draft, expiresAt: event.target.value })} /></label>
        </div>
        <button className="information-primary-button" disabled={saving}>{saving ? 'Publishing…' : 'Publish update'}</button>
      </form>}

      <main className="information-feed">
        {filteredItems.length === 0 ? <div className="information-empty"><i className="fas fa-inbox" /><h2>No updates in this section</h2><p>Published information will appear here for students.</p></div> : filteredItems.map((item) => <article className={`information-item priority-${item.priority.toLowerCase()}`} key={item.id}>
          <div className="information-item-icon"><i className={categories.find((entry) => entry.key === item.category)?.icon ?? 'fas fa-info'} /></div>
          <div className="information-item-body"><div className="information-item-meta"><span>{item.category}</span><time>{formatDate(item.publishAt)}</time>{item.priority !== 'NORMAL' && <b>{item.priority}</b>}</div><h2>{item.title}</h2><p>{item.content}</p>{(item.targetProgramme || item.targetYear || item.targetCourse) && <small className="audience-note">For {item.targetProgramme || 'students'}{item.targetYear ? ` / Year ${item.targetYear}` : ''}{item.targetCourse ? ` / ${item.targetCourse}` : ''}</small>}{item.attachmentUrl && <button type="button" className="attachment-link as-button" onClick={() => setOpenAttachment(openAttachment === item.id ? null : item.id)}><i className="fas fa-paperclip" /> {openAttachment === item.id ? 'Hide attachment' : 'View attachment'}</button>}{openAttachment === item.id && <AttachmentViewer item={item} />}</div>
          {isStaff && <div className="information-item-actions"><button onClick={() => togglePublished(item)}>{item.published ? 'Unpublish' : 'Publish'}</button>{localStorage.getItem('role') === 'ADMIN' && <button onClick={() => remove(item)}>Delete</button>}</div>}
        </article>)}
      </main>
    </div>
  );
}
