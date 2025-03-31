import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AttendanceData } from "@/lib/constants";
import AttendanceTable from "@/components/attendance-table";
import { base64ToFile } from '@/lib/utils';

interface ProcessedData {
  students: AttendanceData[];
}

const AttendanceUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { courseId } = useParams();
  const { data: course } = useCourse(courseId);

  const processImageMutation = useMutation({
    mutationFn: async (imageData: string) => {
      
      const file = base64ToFile(imageData, "attendance.jpg", "image/jpeg");
      const formData = new FormData();
      formData.append("image", file);
      
      // Add student names to the request if we have course data
      if (course?.students) {
        const studentNames = course.students.map(student => student.name);
        formData.append('names', JSON.stringify(studentNames));
      }
      
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
      console.log(formData);
      return response.data as ProcessedData;
    },
    onSuccess: (data) => {
      toast.success("Kép sikeresen feldolgozva");
      console.log("Feldolgozott adat:", data);
      setProcessedData(data);
      setShowResults(true);
    },
    onError: (error) => {
      toast.error("Sikertelen képfeldolgozás");
      console.error("Képfeldolgozási hiba:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !date) {
      toast.error("Kérlek válassz dátumot és tölts fel egy képet");
      return;
    }
    handleProcessImage();
  };

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
    <Container className="py-8">
      <div className="max-w-2xl mx-auto space-y-6 mb-8">
        <h1 className="text-2xl font-bold text-center">
          Jelenléti lista feltöltése
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Dátum</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy. MMMM d.", { locale: hu }) : <span>Válassz dátumot</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    weekStartsOn={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!isCameraActive ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    Feltöltés eszközről
                  </Button>
                  <Button type="button" onClick={startCamera} className="flex-1">
                    Fénykép készítése
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
                  <Button type="button" onClick={captureImage} className="flex-1">
                    Fénykép készítése
                  </Button>
                  <Button
                    type="button"
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    Mégsem
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
                    type="submit"
                    className="flex-1"
                    disabled={processImageMutation.isPending}
                  >
                    {processImageMutation.isPending
                      ? "Feldolgozás folyamatban..."
                      : "Kép feldolgozása"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setImage(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Kép törlése
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      {showResults && (
        <AttendanceTable 
          attendanceImage={image!}
          attendanceData={processedData?.students || []} 
          courseId={courseId!}
          date={date}
        />
      )}
    </Container>
  );
};

export default AttendanceUpload;
