import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Download, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // --- CLIPDROP API LOGIC ---
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);

    const API_KEY = import.meta.env.VITE_CLIPDROP_API_KEY;

    if (!API_KEY) {
      alert("API Key missing! Check .env file.");
      setLoading(false);
      return;
    }

    try {
      // ClipDrop ko JSON nahi, FormData chahiye hota hai
      const form = new FormData();
      form.append('prompt', prompt);

      // Hum '/api-clipdrop' proxy use kar rahe hain (Vite config se)
      const response = await fetch('/api-clipdrop/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          // Note: Content-Type header mat lagana, browser khud lagayega
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to generate. Check your API Quota.");
      }

      // ClipDrop direct image file (Blob) bhejta hai
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setGeneratedImage(imageUrl);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="app-container">
        
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <Sparkles size={28} color="#ec4899" />
            NEXUS<span>.AI</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)' }}>Powered by ClipDrop</div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1 className="title-gradient">Dream It. Generate It.</h1>
          <p className="subtitle">
            Create stunning visuals with ClipDrop's high-quality AI engine. 
            Professional grade results in seconds.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel"
        >
          <input 
            type="text" 
            className="search-input"
            placeholder="A futuristic city with flying cars..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? <Zap className="animate-spin" /> : <Zap />} 
            {loading ? "Designing..." : "Generate"}
          </button>
        </motion.div>

        {/* Result Area */}
        <AnimatePresence>
          {(loading || generatedImage) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="result-container"
            >
              <div className="image-frame">
                {loading ? (
                  <div className="loading-pulse"></div>
                ) : (
                  <>
                    <img src={generatedImage} alt="AI Art" className="generated-img" />
                    <a href={generatedImage} download="nexus-clipdrop.jpg" className="btn-generate" 
                       style={{ position: 'absolute', bottom: '20px', borderRadius: '50px' }}>
                      <Download size={18} /> Download HD
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <div className="features-grid">
          {[
            { icon: Zap, title: "Pro Quality", text: "Powered by ClipDrop Engine" },
            { icon: ImageIcon, title: "High Detail", text: "Perfect for Art & Design" },
            { icon: Layers, title: "Fast", text: "Generates in seconds" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="feature-card"
            >
              <div className="icon-box"><item.icon size={24} /></div>
              <h3>{item.title}</h3>
              <p style={{ color: '#aaa', marginTop: '5px' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </>
  );
}

export default App;