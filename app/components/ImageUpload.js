'use client'
import React, { useState } from "react";

const ImageUpload = ({ onGenerateText }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Handles changes in the file input field
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handles the "Generate Text" button click
  const handleGenerateText = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageBuffer = reader.result;
      if (typeof imageBuffer === "string" || !imageBuffer) {
        alert("Could not read the image file.");
        return;
      }
      await onGenerateText(imageBuffer);
    };
    reader.readAsArrayBuffer(selectedImage);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewImage && (
        <img
          src={previewImage}
          alt="Uploaded preview"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <button onClick={handleGenerateText}>Generate Text</button>
    </div>
  );
};

export default ImageUpload;
