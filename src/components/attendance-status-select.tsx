import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AttendanceStatus = "Megjelent" | "Igazoltan távol" | "Nem jelent meg" | "Késett";

interface AttendanceStatusSelectProps {
  value: AttendanceStatus;
  onChange: (value: AttendanceStatus) => void;
  className?: string;
}

const getStatusColor = (status: AttendanceStatus) => {
  switch (status) {
    case "Megjelent":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "Igazoltan távol":
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    case "Nem jelent meg":
      return "bg-red-500 hover:bg-red-600 text-white";
    case "Késett":
      return "bg-gray-700 hover:bg-gray-700 text-white";
    default:
      return "bg-white hover:bg-gray-100";
  }
};

export const AttendanceStatusSelect = ({ value, onChange, className }: AttendanceStatusSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[180px]", getStatusColor(value), "[&_svg]:text-white", className)}>
        <SelectValue placeholder="Jelenlét" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Megjelent">Megjelent</SelectItem>
        <SelectItem value="Igazoltan távol">Igazoltan távol</SelectItem>
        <SelectItem value="Nem jelent meg">Nem jelent meg</SelectItem>
        <SelectItem value="Késett">Késett</SelectItem>
      </SelectContent>
    </Select>
  );
}; 