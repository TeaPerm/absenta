import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCourse } from "@/hooks/useCourse";
import { useParams } from "react-router-dom";


export function Students() {
  const { courseId } = useParams();
  const { data: course, isLoading, isError, error } = useCourse(courseId);

  if (isLoading) {
    return <div>Loading course...</div>;
  }

  if (isError) {
    return <div>Error loading course: {(error as Error).message}</div>;
  }

  const students = course?.students || [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Név</TableHead>
          <TableHead>Neptun-kód</TableHead>
          {/* <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.neptun_code}>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell>{student.neptun_code}</TableCell>
            {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
            {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
