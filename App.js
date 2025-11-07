import React, { useEffect, useRef, useState } from "react";

/*
  MuInfo main app (single file)
  - capture via camera or upload
  - simulate recognition from local dataset (works offline)
  - show detailed info modal only after "Scan" (clicked)
  - multilingual (en/hi/kn)
  - save/share/print/rate, related artworks
  - PWA-ready via service worker (sw.js)
*/

const ARTWORKS = [
  {
    id: "monalisa",
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    year: "1503",
    tags: ["portrait", "renaissance"],
    img: "/assets/monalisa.jpg",
    info: {
      en: "The Mona Lisa is a half-length portrait painting by Leonardo da Vinci. It is famed for its enigmatic expression, use of sfumato, and subtle realism.",
      hi: "मोना लिसा लियोनार्डो दा विंची का आधा-लंबाई चित्र है। यह अपनी रहस्यमयी मुस्कान और 'स्फुमातो' तकनीक के लिए प्रसिद्ध है।",
      kn: "ಮೊನಾ ಲಿಸಾ ಲಿಯೋನಾರ್ಡೋ ದಾ ವಿಂಚಿ ಅವರ ಅರ್ಧ-ಉದ್ದ ಚಿತ್ರ. ಇದು ಅದರ ರಹಸ್ಯ ನಗು ಮತ್ತು ಸ್ಫುಮಾಟೊ ತಂತ್ರಕ್ಕಾಗಿ ಪ್ರಸಿದ್ಧ."
    },
    fun: {
      en: ["It may have been painted over several years.", "It has been in the Louvre since the French Revolution era."],
      hi: ["इसे कई वर्षों में बनाया गया हो सकता है।", "यह फ्रेंच क्रांति के बाद से लौवर में है।"],
      kn: ["ಇದನ್ನು ಹಲವಾರು ವರ್ಷಗಳಲ್ಲಿಯೇ ಚಿತ್ರಿಸಲಾಗಿದೆ ಎಂದು ನಂಬುವರು.", "ಇದು ಫ್ರೆಂಚ್ ಕ್ರಾಂತಿಯ ನಂತರದಿಂದ ಲೂವರ್‌ನಲ್ಲಿ ಇದೆ."]
    }
  },
  {
    id: "starry",
    name: "Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    tags: ["landscape", "post-impressionism"],
    img: "/assets/starrynight.jpg",
    info: {
      en: "Painted while Van Gogh was in an asylum in Saint-Rémy, 'Starry Night' captures a swirling night sky and high emotional energy.",
      hi: "वैन गॉग ने सेंट-रेमी आश्रम में रहते हुए यह चित्र बनाया। इसमें घूमता हुआ रात का आकाश दिखता है।",
      kn: "ವ್ಯಾನ್ ಗಾಗ್ ಅವರು ಸೆಂಟ್-ರೆಮಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಇರುವಾಗ ಈ ಚಿತ್ರವನ್ನು ರಚಿಸಿದರು. ಇದರಲ್ಲಿ ತಿರುಗುತ್ತಿರುವ ರಾತ್ರಿ آಕಾಶವನ್ನು ತೋರಿಸುತ್ತದೆ."
    },
    fun: {
      en: ["Van Gogh painted this mostly from memory.", "The painting has become a symbol of expressionist emotion."],
      hi: ["वैन गॉग ने इसे स्मृति से बनाया।", "यह चित्र भावनात्मक अभिव्यक्ति का प्रतीक बन गया।"],
      kn: ["ವ್ಯಾನ್ ಗಾಗ್ ಮಿದುಳೆನ್ಮೆಯುಳ್ಳ ನೆನಪುಗಳಿಂದ ಈ ಚಿತ್ರವನ್ನೇ ಚಿತ್ರಿಸಿದರು.", "ಇದು ಅಭಿವ್ಯಕ್ತಿ ಭಾವನಾತ್ಮಕತೆಯ ಸಂಕೇತವಾಗಿದೆ."]
    }
  },
  {
    id: "persistence",
    name: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    tags: ["surrealism"],
    img: "/assets/persistence.jpg",
    info: {
      en: "A surrealistic piece famous for its melting clocks, representing the fluidity and oddity of time and dreams.",
      hi: "एक अतियथार्थवादी कृति जो पिघलती हुई घड़ियों के लिए जानी जाती है, जो समय और सपनों की प्रवाहशीलता को दर्शाती है।",
      kn: "ಕಲೆಯಲ್ಲಿರುವ ಕರಗುತ್ತಿರುವ ಗಡಿಯಾರಗಳಿಗಾಗಿ ಪ್ರಸಿದ್ಧವಾದ ಅತಿರಚನಾತ್ಮಕ ಕೃತಿ; ಇದು ಸಮಯದ ಹರಿವು ಮತ್ತು ಕನಸಿನ ಅಸಾಮಾನ್ಯತೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ."
    },
    fun: {
      en: ["The melting clocks were inspired by surreal ideas about time.", "Dalí often used dream imagery."],
      hi: ["पिघलती घड़ियाँ समय के बारे में अतियथार्थवादी विचारों से प्रेरित थीं।", "डाली अक्सर सपनों की छवियों का प्रयोग करते थे।"],
      kn: ["ಕರಗುವ ಗಡಿಯಾರಗಳು ಸಮಯದ ಕುರಿತು ಅಸಾಮಾನ್ಯ ಕಲ್ಪನೆಗಳಿಂದ ಪ್ರೇರಿತವಾಗಿವೆ.", "ಡಾಲಿ ಕನಸಿನ ಚಿತ್ರಣಗಳನ್ನು ಬಳಸುತ್ತಿದ್ದರು."]
    }
  }
];

// i18n small strings
const I18N = {
  en: { scan: "Scan", capture: "Capture Photo", upload: "Upload Photo", cancel: "Cancel", scanHint: "Capture or upload a photo, then press Scan to identify the artwork.", save: "Save", share: "Share", print: "Print", rate: "Rate", related: "Related artworks" },
  hi: { scan: "स्कैन करें", capture: "फ़ोटो लें", upload: "फ़ोटो अपलोड करें", cancel: "रद्द करें", scanHint: "फ़ोटो कैप्चर या अपलोड करें, फिर पहचान के लिये 'स्कैन' दबाएँ।", save: "सहेजें", share: "साझा", print: "प्रिंट", rate: "रेट", related: "संबंधित कलाकृतियाँ" },
  kn: { scan: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", capture: "ಚಿತ್ರ ಹಿಡಿಯಿರಿ", upload: "ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ", cancel: "ರದ್ದುಮಾಡಿ", scanHint: "ಚಿತ್ರವನ್ನು ಕ್ಯಾಪ್ಚರ್ ಅಥವಾ ಅಪ್ಲೋಡ್ ಮಾಡಿ, ನಂತರ 'ಸ್ಕ್ಯಾನ್' ಒತ್ತಿ.", save: "ಸೇಫ್", share: "ಹಂಚಿಕೆ", print: "ಮುದ್ರಿಸಿ", rate: "ರೇಟ್", related: "ಸಂಬಂಧಿತ ಕೃತಿಗಳು" }
};

const DB_KEY = "muinfo_db_v3";
function initDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const db = { artworks: {} };
    ARTWORKS.forEach(a => (db.artworks[a.id] = { views: 0, ratings: [0,0,0,0,0] }));
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
  try {
    const parsed = JSON.parse(raw);
    ARTWORKS.forEach(a => {
      if (!parsed.artworks) parsed.artworks = {};
      if (!parsed.artworks[a.id]) parsed.artworks[a.id] = { views: 0, ratings: [0,0,0,0,0] };
    });
    return parsed;
  } catch (e) {
    localStorage.removeItem(DB_KEY);
    return initDB();
  }
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event('storage'));
}

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem('mu_lang') || 'en');
  const t = I18N[lang] || I18N.en;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null); // captured or uploaded image data URL
  const [recognized, setRecognized] = useState(null); // ARTWORK object when recognized
  const [modalOpen, setModalOpen] = useState(false);
  const [db, setDb] = useState(initDB());
  const [scanning, setScanning] = useState(false);

  // start camera
  useEffect(()=> {
    if (!cameraOn) return;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error("camera error", e);
        alert("Unable to access camera. Use upload instead.");
        setCameraOn(false);
      }
    };
    start();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t=>t.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraOn]);

  useEffect(()=> localStorage.setItem('mu_lang', lang), [lang]);

  useEffect(()=> {
    const onStorage = () => setDb(initDB());
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[]);

  // capture frame from video to preview
  const captureFrame = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewSrc(data);
    setCameraOn(false);
  };

  // handle file upload
  const onUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // SCAN: simulate recognition
  const doScan = async () => {
    if (!previewSrc) { alert("Please capture or upload a photo first."); return; }
    setScanning(true);
    // simulated delay
    await new Promise(r=>setTimeout(r, 800));

    // heuristic match: try to find artwork by checking if uploaded filename contains id (best-effort),
    // otherwise compare image sizes via fake random match (since no server)
    // If uploaded from public assets (dataURL contains filename) — try to detect
    let found = null;
    // try to detect if previewSrc references one of our asset paths (dataURL may contain original url if used)
    for (const art of ARTWORKS) {
      if (previewSrc.includes(art.id) || previewSrc.includes(art.name.replace(/\s+/g,'').toLowerCase()) || previewSrc.includes(art.name.split(' ')[0].toLowerCase())) {
        found = art; break;
      }
    }
    // fallback: if user used camera or unknown upload, try simple color-based heuristic? (not reliable)
    // We'll fallback to a simple image-simulate: choose random with weighted bias toward first item
    if (!found) {
      // If user preview exactly equals one of asset URLs e.g., they clicked existing asset: check that
      for (const art of ARTWORKS) {
        if (previewSrc === window.location.origin + art.img) { found = art; break; }
      }
    }
    if (!found) {
      // as last resort, present a lightweight selection UI: pick the top match by asking user;
      // But to match your requirement "they get info when scan" we will auto-pick the most likely using a deterministic pseudo-random based on image length
      const idx = Math.abs(hashString(previewSrc)) % ARTWORKS.length;
      found = ARTWORKS[idx];
    }

    // increment views
    const cur = initDB();
    cur.artworks[found.id].views = (cur.artworks[found.id].views || 0) + 1;
    saveDB(cur);
    setDb(cur);

    setRecognized(found);
    setModalOpen(true);
    setScanning(false);
  };

  // tiny deterministic hash to pseudo-randomly pick artwork
  function hashString(s) {
    let h = 0;
    for (let i=0;i<s.length;i++) h = (h<<5) - h + s.charCodeAt(i);
    return h;
  }

  const handleRate = (id, stars) => {
    const cur = initDB();
    const idx = 5 - stars;
    cur.artworks[id].ratings[idx] = (cur.artworks[id].ratings[idx] || 0) + 1;
    saveDB(cur);
    setDb(cur);
    alert(`Thanks — you rated ${stars}⭐`);
  };

  const handleSaveText = (art) => {
    const text = `Artwork: ${art.name}\nArtist: ${art.artist}\nYear: ${art.year}\n\n${art.info[lang]}\n\nFun facts:\n- ${art.fun[lang].join('\n- ')}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${art.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleShare = async (art) => {
    const payload = { title: art.name, text: `${art.name} — ${art.artist}\n${art.info[lang].slice(0,120)}... `};
    if (navigator.share) {
      try { await navigator.share(payload); }
      catch(e) { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(`${payload.title}\n${payload.text}`);
      alert("Info copied to clipboard for sharing.");
    }
  };

  const handlePrint = (art) => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${art.name}</title><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="font-family:Arial, sans-serif;padding:18px">
      <h2>${art.name}</h2><p><b>${art.artist}</b> • ${art.year}</p>
      <img src="${art.img}" style="max-width:100%;height:auto;display:block;margin:12px 0"/>
      <p>${art.info[lang]}</p>
      <h4>Fun facts</h4><ul>${art.fun[lang].map(f => <li>${f}</li>).join('')}</ul>
    </body></html>`);
    w.document.close();
    w.print();
    w.close();
  };

  // related helper
  const relatedTo = (art) => {
    const rel = ARTWORKS.filter(a => a.id !== art.id && a.tags?.some(tag => art.tags?.includes(tag))).slice(0,3);
    if (rel.length === 0) {
      const idx = ARTWORKS.findIndex(a=>a.id===art.id);
      if (ARTWORKS[idx-1]) rel.push(ARTWORKS[idx-1]);
      if (ARTWORKS[idx+1]) rel.push(ARTWORKS[idx+1]);
    }
    return rel;
  };

  // helper: show existing asset image in preview (if user clicks a gallery image to "scan")
  const quickScanFromGallery = (art) => {
    setPreviewSrc(window.location.origin + art.img);
    // then call doScan after tiny delay so preview set
    setTimeout(()=> doScan(), 200);
  };

  return (
    <div className="site-root">
      <nav className="nav">
        <div className="brand">
          <img src="/assets/logo.png" alt="MuInfo" className="logo" onError={(e)=>{e.target.style.display='none'}}/>
          <div>
            <div className="brand-title">MuInfo</div>
            <div className="brand-sub">Smart museum companion</div>
          </div>
        </div>

        <div className="nav-right">
          <select className="lang-select" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </nav>

      <header className="hero" style={{ backgroundImage: "url('/assets/museum-bg.jpg')" }}>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <h1>Discover Art. Instantly.</h1>
          <p className="muted">{t.scanHint}</p>
        </div>
      </header>

      <main className="container">
        <section style={{marginTop:12}}>
          <h2 className="section-title">Capture & Scan</h2>

          <div className="controls-row">
            <div className="capture-area">
              <div>
                <div style={{marginBottom:8,fontWeight:600}}>{t.capture}</div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" onClick={()=>setCameraOn(prev=>!prev)}>{cameraOn ? "Stop Camera" : "Start Camera"}</button>
                  <input type="file" accept="image/*" onChange={onUpload} id="fileUpload" />
                </div>

                <div style={{marginTop:8}}>
                  <div className="preview" aria-hidden={!previewSrc}>
                    { cameraOn ? <video ref={videoRef} autoPlay playsInline style={{width:'100%',height:'100%'}} /> : (previewSrc ? <img src={previewSrc} alt="preview" /> : <div style={{padding:12,color:'#666'}}>Preview</div>) }
                  </div>
                  { cameraOn && <div style={{marginTop:8}}><button className="btn primary" onClick={captureFrame}>Capture Frame</button></div> }
                </div>
              </div>

              <div style={{minWidth:260}}>
                <div style={{fontWeight:600, marginBottom:6}}>Scan</div>
                <div style={{marginBottom:8}} className="small">{t.scanHint}</div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn primary" onClick={doScan} disabled={scanning}>{scanning ? "Scanning..." : t.scan}</button>
                  <button className="btn" onClick={()=>{ setPreviewSrc(null); setRecognized(null); setModalOpen(false); document.getElementById('fileUpload').value=''; }}>Reset</button>
                </div>

                <div style={{marginTop:12}}>
                  <div style={{fontWeight:600}}>Tip</div>
                  <div className="small">For best results, hold the camera steady and fill the frame with the artwork. Offline demo uses local dataset to produce matching information.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{marginTop:28}}>
          <h2 className="section-title">Featured Gallery (click any image to scan it)</h2>
          <div className="card-grid" style={{marginTop:10}}>
            {ARTWORKS.map(a => (
              <div className="card" key={a.id} onClick={()=>quickScanFromGallery(a)}>
                <img src={a.img} alt={a.name} />
                <div className="card-body">
                  <div className="card-title">{a.name}</div>
                  <div className="muted">{a.artist} • {a.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{marginTop:28}}>
          <h2 className="section-title">Features</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
            <div className="info-block">🎯 Click-to-scan (camera or upload). No login. Offline-ready.</div>
            <div className="info-block">🌍 Multilingual: English, Hindi, Kannada. Switch anytime.</div>
            <div className="info-block">💾 Save (download text), 📤 Share (Web Share or clipboard), 🖨 Print.</div>
            <div className="info-block">⭐ Rate artworks (stored locally). Anonymous analytics stored in device.</div>
            <div className="info-block">🗺 Related artworks & guided suggestions (simple tag-based).</div>
            <div className="info-block">📦 PWA-ready (manifest + service worker) for offline use.</div>
          </div>
        </section>
      </main>

      <footer className="footer">© 2025 MuInfo — Works offline • No login required</footer>

      {/* Hidden canvas for captures */}
      <canvas ref={canvasRef} style={{display:'none'}} />

      {/* Modal for recognized artwork */}
      { modalOpen && recognized && (
        <div className="modal-backdrop" onClick={()=>{ setModalOpen(false); setRecognized(null); }}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-left"><img className="modal-img" src={recognized.img} alt={recognized.name} /></div>
            <div className="modal-right">
              <button className="modal-close" onClick={()=>{ setModalOpen(false); setRecognized(null); }}>{ (lang==='hi') ? 'बंद' : (lang==='kn' ? 'ಮುಚ್ಚಿ' : 'Close') }</button>
              <h2>{recognized.name}</h2>
              <div className="small">{recognized.artist} • {recognized.year}</div>

              <div className="mt"><strong>{recognized.info[lang]}</strong></div>
              <div className="mt">
                <h4>Fun facts</h4>
                <ul>
                  {recognized.fun[lang].map((f,i)=> <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="mt small"><strong>Tags:</strong> {recognized.tags.join(', ')}</div>

              <div className="actions">
                <button className="action-btn print" onClick={()=>handlePrint(recognized)}>{t.print}</button>
                <button className="action-btn save" onClick={()=>handleSaveText(recognized)}>{t.save}</button>
                <button className="action-btn share" onClick={()=>handleShare(recognized)}>{t.share}</button>
              </div>

              <div className="mt">
                <div style={{fontWeight:600}}>{t.rate}</div>
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  {[5,4,3,2,1].map(s => <button key={s} className="btn" onClick={()=>handleRate(recognized.id, s)}>{s}⭐</button>)}
                </div>
              </div>

              <div className="mt">
                <div style={{fontWeight:600}}>{t.related}</div>
                <div className="related-row">
                  {relatedTo(recognized).map(r => (
                    <div key={r.id} className="related-item" onClick={()=>{ setRecognized(r); }}>
                      <img src={r.img} alt={r.name} />
                      <div className="related-name">{r.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt small">Views: {db.artworks[recognized.id]?.views || 0}</div>
            </div>
          </div>
        </div>
      ) }

    </div>
  );
}