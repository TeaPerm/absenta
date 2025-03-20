import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";

interface Student {
  name: string;
  has_signed: boolean;
  confidence: number;
  pixel_density: number;
}

interface ProcessedData {
  students: Student[];
}

const Attendance = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { courseId } = useParams();
  const { data: course } = useCourse(courseId);

  const processImageMutation = useMutation({
    mutationFn: async (imageData: string) => {
      // Convert base64 to File object
      const base64Data = imageData.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);

        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }

        byteArrays.push(new Uint8Array(byteNumbers));
      }

      // Create a blob and then a File
      const blob = new Blob(byteArrays, { type: "image/jpeg" });
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      // Create FormData and append both the file and names
      const formData = new FormData();
      formData.append("image", file);
      formData.append("names", JSON.stringify(
        course?.students.map(student => student.name) || []
      ));
      // formData.append("names", JSON.stringify([
      //   "Abrisin Alen",
      //   "Boros Botond",
      //   "Consuegra-Sotolongo Gábor Luis",
      //   "Csontos Dávid Ferenc",
      //   "Dancs Kornél",
      //   "Ferenczy Kata",
      //   "Gombos Vidor Márton",
      //   "Hanyecz Rebeka",
      //   "Kelemen Kevin Tamás",
      //   "Le Thien Nam",
      //   "Mágó Szabolcs",
      //   "Németh Dávid",
      //   "Péter Dávid",
      //   "Rakonczai Soma",
      //   "Simon Raffael",
      //   "Takács Máté",
      //   "Tóth Izabella",
      //   "Tóth Levente",
      //   "Török Bálint Bence",
      //   "Valtai Domonkos"
      // ]));

      // Send the request with FormData
      const response = await axios.post(
        "http://localhost:5000/process_table",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data as ProcessedData;
    },
    onSuccess: (data) => {
      toast.success("Image processed successfully");
      console.log("Processed data:", data);
      setProcessedData(data);
      setShowResults(true);
    },
    onError: (error) => {
      toast.error("Failed to process image");
      console.error("Error processing image:", error);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };

  const handleProcessImage = () => {
    if (image) {
      processImageMutation.mutate(image);
    }
  };

  return (
    <>
      <Container className="py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center">
            Upload Attendance Sheet
          </h1>

          <div className="space-y-4">
            {!isCameraActive ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    Upload from Device
                  </Button>
                  <Button onClick={startCamera} className="flex-1">
                    Take Photo
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="flex gap-4">
                  <Button onClick={captureImage} className="flex-1">
                    Capture
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {image && (
              <div className="space-y-4">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt="Attendance sheet"
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleProcessImage}
                    className="flex-1"
                    disabled={processImageMutation.isPending}
                  >
                    {processImageMutation.isPending
                      ? "Processing..."
                      : "Process Image"}
                  </Button>
                  <Button
                    onClick={() => setImage(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
      {showResults && (
        <div>
          <h1>Results</h1>
          <pre>{JSON.stringify(processedData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default Attendance;
