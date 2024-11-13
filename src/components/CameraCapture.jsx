import React, { useState, useEffect, useRef } from "react";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';

const CameraCapture = ({ onClose }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);
        videoRef.current.srcObject = stream;
        setError(false);
      } catch {
        setError(true);
        console.error("Camera not available on this device.");
      }
    };
    checkCamera();
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL("image/png"));
  };

  return (
    <div className="bg-white rounded-lg max-w-md mx-auto p-6 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
      <h2 className="text-xl font-bold mb-4">Scan Receipt with AI</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Camera not available on this device.</span>
        </div>
      )}

      {!error && hasCamera && (
        <div className="mb-4">
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
          <button onClick={capturePhoto} className="flex items-center gap-2 mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-800">
            <CameraEnhanceIcon fontSize="large"/>
            <span>Capture Receipt</span>
          </button>
        </div>
      )}

      {capturedImage && (
        <>
          <img src={capturedImage} alt="Captured" className="w-full h-auto mt-4 rounded-lg" />
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline"> Receipt captured successfully! Redirecting...</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
