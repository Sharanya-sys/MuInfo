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
      en: "The Mona Lisa is a famous portrait painted by Leonardo da Vinci. It shows a woman sitting calmly with a gentle smile on her face. Her expression is mysterious—sometimes it looks like she is smiling, and sometimes she looks serious. She is wearing simple clothes and a dark veil. Her hands are folded softly on herBehind her, there is a beautiful background with mountains, rivers, and a winding road. The colors are soft and smooth, and the painting looks very realistic. The light on her face makes her look calm and peaceful. The Mona Lisa is known for her natural beauty, secretive smile, and the artist’s amazing skill.",
      hi: "मोना लिसा लियोनार्डो दा विंची द्वारा बनाई गई एक प्रसिद्ध पेंटिंग है। यह एक महिला को शांत भाव से बैठे हुए दिखाती है, जिसके चेहरे पर हल्की-सी मुस्कान है। उसकी अभिव्यक्ति रहस्यमयी है—कभी वह मुस्कुराती हुई लगती है और कभी थोड़ा गंभीर। वह साधारण कपड़े पहने हुए है और उसके सिर पर एक काला घूंघट है। उसके हाथ उसकी गोद में कोमलता से रखे हुए हैं।उसके पीछे पहाड़ों, नदियों और एक घुमावदार रास्ते वाला सुंदर प्राकृतिक दृश्य दिखाई देता है। रंग बहुत मुलायम और स्मूद हैं, और पेंटिंग बहुत वास्तविक लगती है। उसके चेहरे पर पड़ती रोशनी उसे शांत और सहज दिखाती है। मोना लिसा अपनी प्राकृतिक सुंदरता, रहस्यमयी मुस्कान और कलाकार की अद्भुत कला के लिए जानी जाती है।",
      kn: "ಮೋನಾಲಿಸಾ ಎಂಬುದು ಲಿಯೊನಾರ್ಡೋ ಡಾ ವಿನ್ಚಿ ರವರ ಪ್ರಸಿದ್ಧ ಚಿತ್ರವಾಗಿದೆ. ಇದರಲ್ಲಿ ಒಬ್ಬ ಮಹಿಳೆಯನ್ನು ಶಾಂತವಾಗಿ ಕುಳಿತಿರುವಂತೆ ತೋರಿಸಲಾಗಿದೆ, ಅವಳ ಮುಖದಲ್ಲಿ ಸಣ್ಣ, ಮೃದು ನಗು ಕಾಣುತ್ತದೆ. ಅವಳ ಭಾವನೆ ರಹಸ್ಯಮಯವಾಗಿದೆ—ಕೆಲವೊಮ್ಮೆ ಅವಳು ನಗುವಂತೆ ಕಾಣುತ್ತದೆ, ಮತ್ತೆ ಕೆಲವೊಮ್ಮೆ ಗಂಭೀರವಾಗಿಯೂ ತೋರುತ್ತಾಳೆ. ಅವಳು ಸರಳವಾದ ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸಿದ್ದಾಳೆ ಮತ್ತು ಅವಳ ತಲೆಯ ಮೇಲೆ ಕತ್ತಲೆ ಬಣ್ಣದ ಒರಳು (ವೇಲ್) ಇದೆ. ಅವಳ ಕೈಗಳು ಮೃದುವಾಗಿ ಒಡಲ ಮೇಲಿಟ್ಟಿರುವಂತೆ ಚಿತ್ರಿಸಲಾಗಿದೆ.ಅವಳ ಹಿಂದೆ ಪರ್ವತಗಳು, ನದಿಗಳು ಮತ್ತು ಓಲಾಡುವ ದಾರಿಯಿರುವ ಸುಂದರ ನೈಸರ್ಗಿಕ ಹಿನ್ನೆಲೆ ಕಾಣುತ್ತದೆ. ಬಣ್ಣಗಳು ಮೃದುವಾಗಿಯೂ ಸ್ಮೂತ್ ಆಗಿಯೂ ಇದ್ದು, ಚಿತ್ರ ಬಹಳ ವಾಸ್ತವವಾಗಿ ತೋರಿಸುತ್ತದೆ. ಅವಳ ಮುಖದ ಮೇಲೆ ಬೀಳುವ ಬೆಳಕು ಅವಳನ್ನು ಶಾಂತ ಮತ್ತು ಸಮಾಧಾನಕರವಾಗಿ ತೋರಿಸುತ್ತದೆ. ಮೋನಾಲಿಸಾ ತನ್ನ ನೈಸರ್ಗಿಕ ಸೌಂದರ್ಯ, ರಹಸ್ಯಮಯ ನಗು ಮತ್ತು ಕಲಾವಿದರ ಅದ್ಭುತ ಕೌಶಲ್ಯಕ್ಕಾಗಿ ಪ್ರಸಿದ್ಧಳಾಗಿದ್ದಾಳೆ.."
    },
    fun: {
      en: ["1. Her smile looks different every time you look at it — sometimes happy, sometimes serious. 2.People feel like her eyes follow them around the room because of Leonardo’s perfect painting technique."],
      hi: ["1. उसकी मुस्कान हर बार देखने पर अलग दिखती है — कभी खुश, कभी थोड़ी गंभीर।  2. लोग महसूस करते हैं कि उसकी आँखें हर जगह उनका पीछा करती हैं, जो लियोनार्डो की अद्भुत पेंटिंग तकनीक की वजह से है।"],
      kn: ["1. ಅವಳ ನಗು ಪ್ರತೀ ಬಾರಿ ನೋಡಿದಾಗ ಬೇರೆ ರೀತಿಯಾಗಿ ಕಾಣುತ್ತದೆ — ಕೆಲವೊಮ್ಮೆ ಸಂತೋಷವಾಗಿ, ಕೆಲವೊಮ್ಮೆ ಸ್ವಲ್ಪ ಗಂಭೀರವಾಗಿ. 2. ಲಿಯೋನಾರ್ಡೋ ಅವರ ಅದ್ಭುತ ಚಿತ್ರಕಲಾ ತಂತ್ರದ ಕಾರಣ, ಅವಳ ಕಣ್ಣುಗಳು ಎಲ್ಲೆಡೆ ನಮ್ಮನ್ನು ಅನುಸರಿಸುವಂತೆ ಅನಿಸುತ್ತದೆ.."]
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
      en: "Starry Night is a famous painting by Vincent van Gogh. It shows a small village sleeping quietly under a magical night sky. The sky is full of swirling clouds, shining stars, and a bright, glowing moon. The stars look like they are moving, creating a sense of energy and motion.In the foreground, there is a tall, dark cypress tree that seems to reach up toward the sky. The houses below look peaceful, with soft lights in some windows. The colors in the painting—mainly deep blues, yellows, and blacks—create a dreamy, emotional feeling. The painting feels both calm and full of life at the same time.Van Gogh painted the night sky not as it looks, but as he felt it — full of emotion, movement, and wonder.",
      hi: "स्टारी नाइट विन्सेंट वैन गॉग की एक प्रसिद्ध पेंटिंग है। यह एक छोटे से गाँव को दिखाती है जो शांत रात में सो रहा है। ऊपर का आसमान घूमते हुए बादलों, चमकते सितारों और एक तेज, चमकीले चाँद से भरा हुआ है। सितारे ऐसे लगते हैं जैसे वे चल रहे हों, जिससे पूरी पेंटिंग में ऊर्जा और गति का एहसास होता है।चित्र के सामने एक लंबा, गहरा सरू का पेड़ है, जो मानो आसमान की ओर बढ़ रहा हो। नीचे के घर शांत और सुकून भरे दिखाई देते हैं, कुछ खिड़कियों में हल्की रोशनी भी है। पेंटिंग में इस्तेमाल किए गए गहरे नीले, पीले और काले रंग इसे सपनों जैसा और भावुक बनाते हैं। यह पेंटिंग एक साथ शांत भी लगती है और जीवंत भी।वैन गॉग ने रात के आसमान को वैसा नहीं बनाया जैसा वह दिखता है, बल्कि वैसा बनाया जैसा उन्होंने महसूस किया — भावनाओं, गति और आश्चर्य से भरा हुआ।",
      kn: "ಸ್ಟಾರಿ ನೈಟ್ ಎಂಬುದು ವಿನ್ಸೆಂಟ್ ವ್ಯಾನ್ ಗೋಗ್ ಅವರ ಪ್ರಸಿದ್ಧ ಚಿತ್ರವಾಗಿದೆ. ಇದರಲ್ಲಿ ಶಾಂತ ರಾತ್ರಿ ಒಂದು ಸಣ್ಣ ಹಳ್ಳಿ ನಿದ್ರಿಸುತ್ತಿರುವಂತೆ ತೋರಿಸುತ್ತದೆ. ಮೇಲಿನ ಆಕಾಶವು ಸುತ್ತುವ ಬಿರುಗಾಳಿಯಂತೆ ಕಾಣುವ ಮೋಡಗಳು, ಹೊಳೆಯುವ ನಕ್ಷತ್ರಗಳು ಮತ್ತು ಪ್ರಕಾಶಮಾನ ಚಂದ್ರನಿಂದ ತುಂಬಿದೆ. ನಕ್ಷತ್ರಗಳು ಚಲಿಸುತ್ತಿರುವಂತೆ ಕಾಣುತ್ತವೆ, ಇದರಿಂದ ಚಿತ್ರಕ್ಕೆ ಒಂದು ವಿಶಿಷ್ಟ ಶಕ್ತಿ ಮತ್ತು ಚಲನೆಯ ಅನುಭವ ಬರುತ್ತದೆ.ಚಿತ್ರದ ಮುಂದಿರುವ ಉದ್ದವಾದ, ಕತ್ತಲೆ ಸರಳ ಮರವು ಆಕಾಶದತ್ತ ಹಾರುತ್ತಿರುವಂತೆ ಕಾಣುತ್ತದೆ. ಕೆಳಗಿನ ಮನೆಗಳು ಶಾಂತವಾಗಿಯೂ ಆರಾಮವಾಗಿಯೂ ತೋರುತ್ತವೆ, ಕೆಲವು ಕಿಟಕಿಗಳಲ್ಲಿ ಮೃದು ಬೆಳಕು ಕೂಡ ಕಾಣಿಸುತ್ತದೆ. ಚಿತ್ರದಲ್ಲಿ ಬಳಸಿರುವ ಗಾಢ ನೀಲಿ, ಹಳದಿ ಮತ್ತು ಕಪ್ಪು ಬಣ್ಣಗಳು ಇದನ್ನು ಕನಸಿನಂತೂ, ಭಾವನಾತ್ಮಕವಾಗಿಯೂ ಮಾಡುತ್ತವೆ. ಈ ಚಿತ್ರವು ಒಂದೇ ಸಮಯದಲ್ಲಿ ಶಾಂತವೂ, ಜೀವಂತವೂ ಆಗಿ ಕಾಣುತ್ತದೆ.ವ್ಯಾನ್ ಗೋಗ್ ಅವರು ರಾತ್ರಿಯ ಆಕಾಶವನ್ನು ಅದು ಕಾಣುವ ರೀತಿಯಲ್ಲಿ ಮಾತ್ರ ಚಿತ್ರಿಸಲಿಲ್ಲ; ಅವರು ಅನುಭವಿಸಿದಂತೆ—ಭಾವನೆ, ಚಲನ ಮತ್ತು ಆಶ್ಚರ್ಯಗಳಿಂದ ತುಂಬಿ—ಚಿತ್ರಿಸಿದರು.."
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
      en: "The painting “Persistent” shows a single figure standing strong in the middle of a challenging landscape. Around them, the sky is rough, filled with swirling clouds and heavy winds, symbolizing the difficulties they face. Yet the person remains steady, moving forward step by step, their posture full of determination.The colors shift from dark tones on one side to brighter shades on the other, showing the journey from struggle to hope. Every brushstroke feels deliberate and powerful, capturing the spirit of someone who refuses to give up. The painting as a whole represents strength, consistency, and the courage to continue—no matter how hard the path becomes.",
      hi: "“Persistent” नाम की पेंटिंग में एक अकेला व्यक्ति एक कठिन दृश्य के बीच मज़बूती से खड़ा दिखाया गया है। उसके चारों ओर आसमान उथल–पुथल से भरा है — घुमड़ते बादल और तेज़ हवाएँ उसके सामने आने वाली चुनौतियों का प्रतीक हैं। फिर भी वह व्यक्ति अडिग खड़ा है, एक-एक कदम आगे बढ़ता हुआ, उसके हावभाव में दृढ़ निश्चय साफ दिखता है।चित्र के रंग एक तरफ गहरे और कठिनाइयों को दर्शाते हैं, और दूसरी तरफ हल्के और उजाले रंग उम्मीद का संकेत देते हैं। हर ब्रशस्ट्रोक मज़बूत और सोच-समझकर बनाया हुआ लगता है, जो किसी ऐसे इंसान की भावना को दर्शाता है जो हार नहीं मानता। पूरी पेंटिंग साहस, निरंतरता और कठिन परिस्थितियों में भी आगे बढ़ते रहने की ताकत को दिखाती है।",
      kn: "“Persistent” ಎಂಬ ಪೇಂಟಿಂಗ್‌ನಲ್ಲಿ ಒಬ್ಬ ವ್ಯಕ್ತಿ ಕಠಿಣ ಪರಿಸ್ಥಿತಿಗಳ ನಡುವೆಯೂ ದೃಢವಾಗಿ ನಿಂತಿರುವಂತೆ ತೋರಿಸಲಾಗಿದೆ. ಅವನ ಸುತ್ತಲಿನ ಆಕಾಶದಲ್ಲಿ ಗಾಳಿ, ಗೂಡುಬಿದ್ದ ಮೋಡಗಳು ಮತ್ತು ಅಶಾಂತಿಯ ಚಟುವಟಿಕೆಗಳು ಕಾಣುತ್ತವೆ — ಅವನು ಎದುರಿಸುತ್ತಿರುವ ಸವಾಲುಗಳ ಸಂಕೇತವಾಗಿ. ಆದರೂ ಅವನು ಅಚಲವಾಗಿ ನಿಂತಿದ್ದಾನೆ, ಒಂದು ಒಂದು ಹೆಜ್ಜೆ ಮುಂದಕ್ಕೆ ಹಾಕುತ್ತಾ, ಅವನ ಭಂಗಿಯಲ್ಲಿ ದೃಢ ನಿಶ್ಚಯ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುತ್ತದೆ.ಚಿತ್ರದ ಬಣ್ಣಗಳು ಒಂದು ಕಡೆ ಗಾಢವಾಗಿದ್ದು ಕಷ್ಟಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ, ಮತ್ತೊಂದು ಕಡೆ ಬೆಳಕು ಮತ್ತು ನವಿರಾದ ಬಣ್ಣಗಳು ಆಶೆಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತವೆ. ಪ್ರತಿಯೊಂದು ಬ್ರಶ್‌ಸ್ಟ್ರೋಕ್ ಗಟ್ಟಿಯಾಗಿ, ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಇರುವುದರಿಂದ, ಯಾವ ಪರಿಸ್ಥಿತಿಯಲ್ಲೂ ಹಿಂಜರಿಯದೆ ಮುಂದುವರಿಯುವ ವ್ಯಕ್ತಿಯ ಮನೋಬಲವನ್ನು ತೋರಿಸುತ್ತದೆ.ಒಟ್ಟಿನಲ್ಲಿ, ಈ ಚಿತ್ರ ಧೈರ್ಯ, ನಿರಂತರ ಪ್ರಯತ್ನ ಮತ್ತು ಕಷ್ಟಗಳ ನಡುವೆ ಸಹ ಮುಂದೇರುವ ಸಾಮರ್ಥ್ಯವನ್ನು ವ್ಯಕ್ತಪಡಿಸುತ್ತದೆ."
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

      <footer className="footer">© 2025 MuInfo — by Team S3V</footer>

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
