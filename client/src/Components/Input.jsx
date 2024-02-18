import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";

const DetectionTable = ({ detectionResult }) => {
  if (!detectionResult || detectionResult.predictions.length === 0) {
    return null;
  }

  const predictions = detectionResult.predictions;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Detection Results</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Class</th>
            <th style={tableHeaderStyle}>Confidence</th>
            <th style={tableHeaderStyle}>X</th>
            <th style={tableHeaderStyle}>Y</th>
            <th style={tableHeaderStyle}>Width</th>
            <th style={tableHeaderStyle}>Height</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr key={index} style={tableRowStyle}>
              <td style={tableCellStyle}>{prediction.class}</td>
              <td style={tableCellStyle}>{prediction.confidence}</td>
              <td style={tableCellStyle}>{prediction.x}</td>
              <td style={tableCellStyle}>{prediction.y}</td>
              <td style={tableCellStyle}>{prediction.width}</td>
              <td style={tableCellStyle}>{prediction.height}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getRespectiveSizesDivident = (
  originalX,
  originalY,
  expectedX = originalX,
  expectedY = originalY
) => {
  const xDivident = originalX / expectedX;
  const yDivident = originalY / expectedY;
  return { xDivident, yDivident };
};

const Input = () => {
  const [imageLink, setImageLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const containerRef = useRef(null);
  const [divDimesions, setDivDimensions] = useState(null);
  const elementRef = useRef(null);
  const [dividents, setDividents] = useState({ xDivident: 1, yDivident: 1 });

  const handleInputChange = (event) => {
    const link = event.target.value;
    setImageLink(link);
    setImagePreview(null);
    setDetectionResult(null);
  };

  const handlePreview = () => {
    setLoading(true);
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

  useEffect(() => {
    if (!!containerRef && !divDimesions) {
      setDivDimensions(containerRef?.current?.getBoundingClientRect());
      const dividents = getRespectiveSizesDivident(
        divDimesions.width,
        divDimesions.height
      );
    }
  }, [containerRef]);

  return (
    <Fragment>
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
          ref={containerRef}
          style={{ position: "relative", width: "fit-content" }}
        >
          <img
            src={imagePreview}
            alt="Image Preview"
            style={imagePreviewStyle}
            onLoad={() => setLoading(false)}
          />
          {detectionResult?.predictions?.length > 0 && (
            <div
              ref={elementRef}
              style={{
                top: `${
                  (detectionResult.predictions[0].y -
                    detectionResult.predictions[0].height / 2) /
                  dividents.yDivident
                }px`,
                left: `${
                  (detectionResult.predictions[0].x -
                    detectionResult.predictions[0].width / 2) /
                  dividents.xDivident
                }px`,
                width: `${
                  detectionResult.predictions[0].width / dividents.xDivident
                }px`,
                height: `${
                  detectionResult.predictions[0].height / dividents.yDivident
                }px`,
                ...elementStyle,
              }}
            >
              <div style={elementText}>{"Some text here"}</div>
            </div>
          )}
        </div>
      )}
      {detectionResult && detectionResult.predictions.length > 0 ? (
        <div>
          <DetectionTable detectionResult={detectionResult} />
        </div>
      ) : (
        <p style={noDroneFoundStyle}></p>
      )}
    </Fragment>
  );
};

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
  // overflow: "auto",
  display: "flex",
};

const noDroneFoundStyle = {
  color: "red",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: "10px",
};

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const tableRowStyle = {
  border: "1px solid #ddd",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  textAlign: "center",
  padding: "8px",
};

const elementStyle = {
  backgroundColor: "black",
  opacity: 0.5,
  border: "3px solid lightgreen",
  position: "absolute",
};

const elementText = {
  backgroundColor: "lightgreen",
  fontSize: "18px",
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
  position: "absolute",
  top: "-30px",
  left: "-2px",
  padding: "4px",
};

export default Input;
