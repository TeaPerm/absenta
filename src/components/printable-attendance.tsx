import { format } from "date-fns";
import { hu } from "date-fns/locale";

interface Student {
  name: string;
  neptun_code: string;
}

interface PrintableAttendanceProps {
  students: Student[];
  courseName: string;
  date: Date;
  startTime?: string;
  endTime?: string;
}

export function PrintableAttendance({ students, courseName, date, startTime, endTime }: PrintableAttendanceProps) {
  return (
    <div className="print:scale-[0.5] print:origin-top-left print:absolute print:top-0 print:left-0 w-[148mm] h-[210mm] p-2">
      <div className="border-2 border-black p-4 flex flex-col items-center print:border-2 print:border-black">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">{courseName}</h1>
          <p className="text-base">
            {format(date, "yyyy. MMMM d.", { locale: hu })}
            {(startTime || endTime) && (
              <span className="ml-2">
                {startTime && <span>{startTime}</span>}
                {startTime && endTime && <span> - </span>}
                {endTime && <span>{endTime}</span>}
              </span>
            )}
          </p>
        </div>

        <table className="w-full border-collapse border-2 border-black print:border-2 print:border-black">
          <thead>
            <tr className="border-b-2 border-black print:border-b-2 print:border-black">
              <th className="text-left py-2 px-2 border-r-2 border-black w-[10%] print:border-r-2 print:border-black text-sm">Sorszám</th>
              <th className="text-left py-2 px-2 border-r-2 border-black w-[40%] print:border-r-2 print:border-black text-sm">Név</th>
              <th className="text-left py-2 px-2 border-r-2 border-black w-[10%] print:border-r-2 print:border-black text-sm">Neptun kód</th>
              <th className="text-center py-2 px-2 w-[20%] text-sm">Aláírás</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.neptun_code} className="border-b-2 border-black print:border-b-2 print:border-black">
                <td className="py-2 px-2 border-r-2 border-black w-[10%] print:border-r-2 print:border-black text-sm">{index + 1}</td>
                <td className="py-2 px-2 border-r-2 border-black w-[40%] print:border-r-2 print:border-black text-sm">{student.name}</td>
                <td className="py-2 px-2 border-r-2 border-black w-[10%] print:border-r-2 print:border-black text-sm">{student.neptun_code}</td>
                <td className="py-2 px-2 border-l-2 border-black w-[20%] print:border-l-2 print:border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 