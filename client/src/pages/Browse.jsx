import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import CategoryIcon from '../components/CategoryIcon';
import { CATEGORIES } from '../utils/constants';
import { Search } from 'lucide-react';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings]         = useState([]);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');

  const category = searchParams.get('category') || 'all';
  const page     = parseInt(searchParams.get('page') || '1');

  const fetchListings = async (searchVal) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category !== 'all') params.category = category;
      const q = searchVal !== undefined ? searchVal : search;
      if (q.trim()) params.search = q.trim();
      const res = await api.get('/listings', { params });
      setListings(res.data.listings);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, [category, page]);

  const handleSearch = (e) => { e.preventDefault(); fetchListings(search); };
  const setCategory  = (val) => setSearchParams({ category: val, page: 1 });
  const setPage      = (p)   => setSearchParams({ category, page: p });

  /* ─── pill style helper ─────────────────── */
  const pill = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
    padding: '0.375rem 0.875rem',
    fontSize: '0.8125rem', fontWeight: 500,
    borderRadius: '9999px',
    border: active ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0',
    background: active ? '#7c3aed' : '#fff',
    color: active ? '#fff' : '#475569',
    cursor: 'pointer', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <div className="page-wrap">
      <div className="inner">

        {/* ── Page header ─────────────────── */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            Browse listings
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Find someone who has what you need and wants what you offer.
          </p>
        </div>

        {/* ── Search bar ──────────────────── */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              type="text"
              className="field-plain"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by skill, title, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '0.625rem 1.25rem', background: '#7c3aed', color: '#fff', fontWeight: 600, fontSize: '0.875rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Search
          </button>
        </form>

        {/* ── Category filter ─────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          <button style={pill(category === 'all')} onClick={() => setCategory('all')}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.value} style={pill(category === cat.value)} onClick={() => setCategory(cat.value)}>
              <CategoryIcon name={cat.icon} size={12} className={category === cat.value ? 'text-white' : 'text-slate-400'} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Result count ────────────────── */}
        {!loading && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            {total} result{total !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Grid ────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', height: '13rem', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Search size={32} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>No listings found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}

        {/* ── Pagination ──────────────────── */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginTop: '2.5rem' }}>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.375rem',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                  background: page === i + 1 ? '#7c3aed' : '#fff',
                  color: page === i + 1 ? '#fff' : '#475569',
                  border: page === i + 1 ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
