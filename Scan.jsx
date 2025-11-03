import React, { useState } from 'react';

export default function Scan() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Scan Artwork</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && <img src={image} alt="Preview" className="mt-4 w-full" />}
      {result && (
        <div className="mt-4">
          <h3>{result.title}</h3>
          <p>{result.artist} ({result.year})</p>
          <p>{result.description}</p>
        </div>
      )}
    </div>
  );
}