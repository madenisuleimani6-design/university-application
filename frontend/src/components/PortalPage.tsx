import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/portal.css';

export interface PortalColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface PortalAction {
  label: string;
  variant: 'primary' | 'success' | 'info' | 'secondary' | 'warning' | 'dark';
  onClick: (row: Record<string, unknown>) => void;
  disabled?: (row: Record<string, unknown>) => boolean;
}

interface PortalPageProps {
  title: string;
  breadcrumbs: { label: string; to?: string }[];
  columns: PortalColumn[];
  data: Record<string, unknown>[];
  rowActions?: PortalAction[];
  showAdd?: boolean;
  onAdd?: () => void;
  emptyMessage?: string;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let className = 'badge-status';
  if (normalized === 'success' || normalized === 'paid' || normalized === 'approved') {
    className += ' badge-success';
  } else if (normalized === 'pending') {
    className += ' badge-pending';
  } else if (normalized === 'submitted') {
    className += ' badge-submitted';
  } else {
    className += ' badge-default';
  }
  return <span className={className}>{status}</span>;
}

export default function PortalPage({
  title,
  breadcrumbs,
  columns,
  data,
  rowActions,
  showAdd = true,
  onAdd,
  emptyMessage = 'No records found.',
}: PortalPageProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q))
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => setCurrentPage(1);
  const handleClear = () => {
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <div className="portal-container">
      <nav className="portal-breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.label}>
            {i > 0 && <span className="breadcrumb-sep"> / </span>}
            {crumb.to ? (
              <Link to={crumb.to}>{crumb.label}</Link>
            ) : (
              <span className="breadcrumb-current">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="portal-card">
        <h2 className="portal-title">{title}</h2>

        <div className="portal-search">
          <input
            type="text"
            className="portal-search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="portal-search-actions">
            <button type="button" className="portal-btn portal-btn-search" onClick={handleSearch}>
              Search
            </button>
            <button type="button" className="portal-btn portal-btn-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="portal-toolbar">
            <button type="button" className="portal-btn portal-btn-add" onClick={onAdd}>
              Add +
            </button>
          </div>
        )}

        <div className="portal-table-wrapper">
          <table className="portal-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>
                    {col.label}
                    <i className="fas fa-sort portal-sort-icon"></i>
                  </th>
                ))}
                {rowActions && rowActions.length > 0 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (rowActions ? 1 : 0)} className="portal-empty">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr key={String(row.id ?? idx)}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : col.key === 'status'
                            ? <StatusBadge status={String(row[col.key] ?? '')} />
                            : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                    {rowActions && rowActions.length > 0 && (
                      <td className="portal-actions-cell">
                        {rowActions.map((action) => {
                          const isDisabled = action.disabled?.(row);
                          return (
                            <button
                              key={action.label}
                              type="button"
                              className={`portal-action-btn portal-action-${action.variant}`}
                              onClick={() => action.onClick(row)}
                              disabled={isDisabled}
                            >
                              {action.label}
                            </button>
                          );
                        })}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="portal-pagination">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
