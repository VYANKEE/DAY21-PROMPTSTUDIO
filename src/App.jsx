import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Download, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // --- API LOGIC ---
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);

    const API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

    try {
      const response = await fetch('/api-stability/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7, height: 1024, width: 1024, steps: 30, samples: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed");

      const result = await response.json();
      if (result.artifacts) {
        setGeneratedImage(`data:image/png;base64,${result.artifacts[0].base64}`);
      }
    } catch (error) {
      alert("Error! Check API Key in .env file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background */}
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
            VENKY KA<span>AI</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)' }}>Stable Diffusion XL</div>
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
            Turn words into stunning visuals with the power of AI. 
            Production-ready assets in seconds.
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
            placeholder="A cyberpunk warrior in neon rain..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? <Zap className="animate-spin" /> : <Zap />} 
            {loading ? "Creating..." : "Generate"}
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
                    <a href={generatedImage} download="nexus-art.png" className="btn-generate" 
                       style={{ position: 'absolute', bottom: '20px', borderRadius: '50px' }}>
                      <Download size={18} /> Download
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
            { icon: Zap, title: "Lightning Fast", text: "Powered by SDXL Turbo" },
            { icon: ImageIcon, title: "High Res", text: "1024x1024 Crystal Clear" },
            { icon: Layers, title: "Unlimited", text: "No limits on creativity" }
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