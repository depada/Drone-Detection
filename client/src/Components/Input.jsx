import React, { useState } from "react";
import axios from "axios";

const Input = () => {
  const [imageLink, setImageLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const handleInputChange = (event) => {
    const link = event.target.value;
    setImageLink(link);
    setImagePreview(null); // Reset the preview when input changes
    setDetectionResult(null); // Reset detection result when input changes
  };

  const handlePreview = () => {
    setLoading(true);
    // Set the image preview without validating
    setImagePreview(imageLink);
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);

    axios({
      method: "POST",
      url: "https://detect.roboflow.com/drone-detection-epd5h/1",
      params: {
        api_key: "IN7VpyXDQza12kfZdHir",
        image: imageLink,
      },
    })
      .then(function (response) {
        setDetectionResult(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div style={inputStyle}>
        <input
          type="text"
          placeholder="Enter image link"
          value={imageLink}
          onChange={handleInputChange}
          style={inputFieldStyle}
        />
        <div style={buttonContainerStyle}>
          <button onClick={handlePreview} style={previewButtonStyle}>
            Preview
          </button>
          <button onClick={handleSubmit} style={submitButtonStyle}>
            Submit
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {imagePreview && (
        <div
          style={{
            position: "relative",
            maxWidth: "100%",
            maxHeight: "200px",
            overflow: "hidden",
          }}
        >
          <img
            src={imagePreview}
            alt="Image Preview"
            style={imagePreviewStyle}
            onLoad={() => setLoading(false)}
          />
          {detectionResult && detectionResult.predictions.length > 0 ? (
            <div
              style={{
                position: "absolute",
                border: "2px solid red",
                boxSizing: "border-box",
                left: detectionResult.predictions[0].x / 100 + "%",
                top:
                  (detectionResult.predictions[0].y /
                    detectionResult.image.height) *
                    100 +
                  "%",
                width: detectionResult.predictions[0].width / 65 + "%",
                height:
                  (detectionResult.predictions[0].height /
                    detectionResult.image.height) *
                    100 +
                  "%",
              }}
            ></div>
          ) : (
            <p style={noDroneFoundStyle}>No drone found</p>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px",
};

const inputFieldStyle = {
  padding: "10px",
  marginBottom: "10px",
  width: "300px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "300px",
  marginBottom: "10px",
};

const previewButtonStyle = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#4285f4",
  color: "#fff",
  cursor: "pointer",
  border: "none",
  marginRight: "5px",
};

const submitButtonStyle = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  cursor: "pointer",
  border: "none",
  marginLeft: "5px",
};

const imagePreviewStyle = {
  maxWidth: "100%",
  maxHeight: "200px",
  marginTop: "10px",
};

const noDroneFoundStyle = {
  color: "red",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: "10px",
};

export default Input;
