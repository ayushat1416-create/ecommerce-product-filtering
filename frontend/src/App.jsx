import { useEffect, useMemo, useState } from "react";
import "./app.css";

export default function App() {
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price_asc");

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (minPrice !== "") params.set("minPrice", minPrice);
    if (maxPrice !== "") params.set("maxPrice", maxPrice);

    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "9");

    return params.toString();
  }, [category, minPrice, maxPrice, sort, page]);

  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products?${queryString}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch products");
      }

      setProducts(data.items || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  function clearFilters() {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("price_asc");
    setPage(1);
  }

  const totalPages = meta?.totalPages || 1;

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__inner">
          <div>
            <h1 className="brand">Shop-Kart</h1>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="card__header">
            <h2 className="card__title">Filters</h2>
            <button className="btn btn--ghost" onClick={clearFilters}>
              Clear
            </button>
          </div>

          <div className="filters">
            <div className="field">
              <label className="label">Category</label>
              <select
                className="input"
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
              </select>
            </div>

            <div className="field">
              <label className="label">Min Price (₹)</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="e.g. 500"
                value={minPrice}
                onChange={(e) => {
                  setPage(1);
                  setMinPrice(e.target.value);
                }}
              />
            </div>

            <div className="field">
              <label className="label">Max Price (₹)</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="e.g. 5000"
                value={maxPrice}
                onChange={(e) => {
                  setPage(1);
                  setMaxPrice(e.target.value);
                }}
              />
            </div>

            <div className="field">
              <label className="label">Sort</label>
              <select
                className="input"
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
              >
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="metaRow">
            <div className="chips">
              <span className="chip">
                Page: <b>{meta?.page || page}</b>
              </span>
              <span className="chip">
                Total: <b>{meta?.total ?? "—"}</b>
              </span>
              <span className="chip">
                Pages: <b>{meta?.totalPages ?? "—"}</b>
              </span>
            </div>

            <div className="pagination">
              <button
                className="btn"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              <button
                className="btn"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="results">
          <div className="results__header">
            <h2 className="results__title">Products</h2>
            {loading && <span className="status">Loading…</span>}
          </div>

          {error && (
            <div className="error">
              <b>Error:</b> {error}
              <div className="hint">
                Check if backend is running at <code>localhost:5000</code>.
              </div>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty">
              No products found for the selected filters.
            </div>
          )}

          <div className="grid">
            {products.map((p) => (
              <article key={p._id} className="product">
                <div className="product__top">
                  <div className="product__category">{p.category}</div>
                  <div className="product__price">₹{p.price}</div>
                </div>
                <h3 className="product__title">{p.title}</h3>

                <div className="product__footer">
                  <span className="mini">
                    ID: <code>{String(p._id).slice(-6)}</code>
                  </span>
                  <span className="mini">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
      </footer>
    </div>
  );
}
