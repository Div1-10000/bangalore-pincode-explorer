import { useState } from "react";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setOffices([]);
      return;
    }

    setLoading(true);
    setError("");
    setOffices([]);

    try {
      const response = await fetch(`/api/pincode/${pincode}`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Pincode not found.");
      }

      setOffices(data.offices);
    } catch (err) {
      setError(err.message || "Unable to fetch pincode information.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPincode();
  };

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="container">
        <header className="header">
          <div className="logo">📍</div>

          <div>
            <h1>Bangalore Pincode Explorer</h1>
            <p>
              Find areas, post offices and delivery information using a
              Bangalore pincode.
            </p>
          </div>
        </header>

        <section className="search-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="pincode">Enter Bangalore Pincode</label>

            <div className="search-row">
              <input
                id="pincode"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="e.g. 560001"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
              />

              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          <div className="examples">
            Try Bangalore pincodes such as{" "}
            <button onClick={() => setPincode("560001")}>560001</button>
            <button onClick={() => setPincode("560034")}>560034</button>
            <button onClick={() => setPincode("560100")}>560100</button>
          </div>
        </section>

        {error && (
          <div className="error-card">
            <span>⚠️</span>
            <div>
              <strong>Unable to find pincode</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {offices.length > 0 && (
          <section className="results">
            <div className="results-header">
              <div>
                <span className="section-label">SEARCH RESULTS</span>
                <h2>{offices.length} Post Office(s) Found</h2>
              </div>

              <div className="pincode-badge">
                PIN {offices[0].Pincode}
              </div>
            </div>

            <div className="office-grid">
              {offices.map((office, index) => (
                <article className="office-card" key={index}>
                  <div className="office-icon">🏤</div>

                  <div className="office-content">
                    <h3>{office.Name}</h3>

                    <div className="info-row">
                      <span>Area</span>
                      <strong>{office.Name}</strong>
                    </div>

                    <div className="info-row">
                      <span>District</span>
                      <strong>{office.District}</strong>
                    </div>

                    <div className="info-row">
                      <span>State</span>
                      <strong>{office.State}</strong>
                    </div>

                    <div className="info-row">
                      <span>Delivery</span>
                      <strong className="delivery">
                        {office.DeliveryStatus}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer>
          <span>Built with React + Express</span>
          <span>•</span>
          <span>India Post Data</span>
        </footer>
      </main>
    </div>
  );
}

export default App;