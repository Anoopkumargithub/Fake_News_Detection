import React, { useState } from 'react';
import '../styles/Home.css';

function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setResult('Please enter some text or a URL to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate a fake news detection result
    setTimeout(() => {
      setLoading(false);
      const isFake = Math.random() > 0.5; // Randomly determine fake or real
      setResult(isFake ? 'This news is likely fake.' : 'This news appears to be real.');
    }, 2000);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#home" className="navbar-logo">Fake News Detector</a>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="home-container">
        <h1>Fake News Detection System</h1>
        <p>Enter a news article or URL below to check its authenticity.</p>
        <form onSubmit={handleSubmit} className="detection-form">
          <textarea
            placeholder="Paste news text or URL here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="6"
            className="input-box"
          />
          <div className="button-group">
            <button type="submit" className="submit-button">
              Analyze
            </button>
            <button type="button" className="clear-button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
        {loading && <div className="loading">Analyzing...</div>}
        {result && <div className={`result-box ${result.includes('fake') ? 'fake' : 'real'}`}>{result}</div>}
      </div>
    </div>
  );
}

export default Home;