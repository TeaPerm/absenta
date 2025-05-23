import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourse";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { CalendarIcon, Camera, Image, X, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AttendanceData, SCRIPT_URL } from "@/lib/constants";
import AttendanceTable from "@/components/attendance-table";
import { base64ToFile } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import CameraComponent from "@/components/Camera";

interface ProcessedData {
  students: AttendanceData[];
}

interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

const AttendanceUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showResults, setShowResults] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [progress, setProgress] = useState(0);

  const { courseId } = useParams();
  const { data: course } = useCourse(courseId);

  const getProcessingStageText = (progressValue: number) => {
    if (progressValue < 25) {
      return "Táblázat keresése...";
    } else if (progressValue < 50) {
      return "Oszlopok és cellák keresése...";
    } else if (progressValue < 75) {
      return "Aláírások és nevek feldolgozása...";
    } else {
      return "Adatok ellenőrzése és összesítése...";
    }
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const processImageMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const file = base64ToFile(imageData, "attendance.jpg", "image/jpeg");
      const formData = new FormData();
      formData.append("image", file);

      if (course?.students) {
        const studentNames = course.students.map((student) => student.name);
        formData.append("names", JSON.stringify(studentNames));
      }

      const response = await axios.post(
        `${SCRIPT_URL}/process_table`,
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
      toast.success("Kép sikeresen feldolgozva", {
        style: {
          background: "#0284c7",
          border: "1px solid oklch(90.1% 0.058 230.902)",
          color: "white",
        },
      });
      setProcessedData(data);
      setShowResults(true);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "Ismeretlen hiba történt";
      toast.error(`Sikertelen képfeldolgozás: ${errorMessage}`, {
        style: {
          background: "#dc2626",
          border: "1px solid #fca5a5",
          color: "white",
        },
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (processImageMutation.isPending && progress < 95) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 20) return prev + 0.8;
          if (prev < 40) return prev + 0.6;
          if (prev < 60) return prev + 0.4;
          if (prev < 80) return prev + 0.3;
          return prev + 0.2;
        });
      }, 100);
    }

    if (!processImageMutation.isPending) {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processImageMutation.isPending, progress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !date) {
      toast.error("Kérlek válassz dátumot és tölts fel egy képet", {
        style: {
          background: "#dc2626",
          border: "1px solid #fca5a5",
          color: "white",
        },
      });
      return;
    }
    handleProcessImage();
  };

  const handleClearImage = () => {
    setImage(null);
    setShowResults(false);
    setProcessedData(null);
  };

  const handleProcessImage = () => {
    if (image) {
      setProgress(0);
      processImageMutation.mutate(image);
    }
  };

  // Handle photo captured from CameraComponent
  const handlePhotoCaptured = (photoData: string) => {
    setImage(photoData);
    setIsCameraActive(false);
  };

  const openCamera = () => {
    setIsCameraActive(true);
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  };

  return (
    <Container className="py-4 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Jelenléti ív feltöltése
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
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
                    {date ? (
                      format(date, "yyyy. MMMM d.", { locale: hu })
                    ) : (
                      <span>Válassz dátumot</span>
                    )}
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

            {isCameraActive ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden border">
                  <CameraComponent onCapture={handlePhotoCaptured} onCancel={closeCamera} />
                </div>
              </div>
            ) : image ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                  <img
                    src={image}
                    alt="Attendance sheet"
                    className="object-contain w-full h-full"
                  />
                  <Button
                    type="button"
                    onClick={handleClearImage}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  variant={"theme"}
                  className="w-full"
                  disabled={processImageMutation.isPending}
                >
                  {processImageMutation.isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <div className="flex flex-col items-start">
                        <span>{getProcessingStageText(progress)}</span>
                        <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                          <div
                            className="bg-white h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(Math.round(progress), 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "Kép feldolgozása"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center",
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <Image className="h-10 w-10 text-theme/50 mb-2" />
                  <div className="flex flex-col items-center text-center">
                    <span className="font-medium">
                      {isDragActive
                        ? "Húzd ide a képet"
                        : "Húzd ide a képet vagy kattints a feltöltéshez"}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      JPG, PNG fájlok (max. 10MB)
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">vagy</span>
                </div>

                <Button
                  type="button"
                  onClick={openCamera}
                  variant={"theme"}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Kamera használata
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>

      {showResults && image && (
        <AttendanceTable
          attendanceImage={image}
          attendanceData={processedData?.students || []}
          courseId={courseId!}
          date={date}
        />
      )}
    </Container>
  );
};

export default AttendanceUpload;
