import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CameraComponentProps {
  onCapture: (photoData: string) => void;
  onCancel: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile devices
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg');
    
    onCapture(imageUrl);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl shadow-lg w-full max-w-md"
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <Button
          onClick={takePhoto}
          className="flex-1"
          variant="theme"
        >
          Fénykép készítése
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1"
        >
          Mégsem
        </Button>
      </div>
    </div>
  );
};

export default CameraComponent;
