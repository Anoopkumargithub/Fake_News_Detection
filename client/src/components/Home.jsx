import React, { useState, useEffect } from "react";
import "../styles/Home.css";

function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Simulate progress bar during analysis
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 10 : 100));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setResult("Please enter some text or a URL to analyze.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: input }),
      });

      const data = await response.json();
      if (response.ok) {
        const verdict =
          data.label === "FAKE"
            ? "This news is likely fake."
            : "This news appears to be real.";
        setResult({
          verdict,
          confidence: (data.confidence * 100).toFixed(2),
        });

        // Save analyzed article to the database
        await fetch("http://localhost:5000/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ article: input, result: data }),
        });
      } else {
        setResult("Error analyzing the news. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error analyzing the news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const handleShare = () => {
    if (result) {
      const shareText = `${result.verdict} (Confidence: ${result.confidence}%). Check out this Fake News Detector!`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: "Fake News Detector",
          text: shareText,
          url: shareUrl,
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Navbar */}
      <nav className="navbar">
        <a href="#home" className="navbar-logo">
          Fake News Detector
        </a>
        <ul className="navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </li>
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
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Progress Bar */}
        {loading && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Result Box */}
        {result && (
          <div
            className={`result-box ${
              result.verdict.includes("fake") ? "fake" : "real"
            }`}
          >
            <p>{result.verdict}</p>
            <p>Confidence: {result.confidence}%</p>
            <button className="share-button" onClick={handleShare}>
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
