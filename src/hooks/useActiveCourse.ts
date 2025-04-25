import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "./useAppStore";

/**
 * Hook to manage the active course ID in the sidebar.
 * It automatically sets the active course ID based on the URL parameters.
 * This ensures that the correct course menu item is expanded in the sidebar
 * when navigating between different pages of the same course.
 */
export function useActiveCourse() {
  const { courseId } = useParams();
  const { activeCourseId, setActiveCourseId } = useAppStore(state => ({
    activeCourseId: state.activeCourseId,
    setActiveCourseId: state.setActiveCourseId,
  }));

  // Set active course ID when courseId parameter changes
  useEffect(() => {
    if (courseId && courseId !== activeCourseId) {
      setActiveCourseId(courseId);
    }
  }, [courseId, activeCourseId, setActiveCourseId]);

  return {
    activeCourseId,
    setActiveCourseId,
    isCourseActive: courseId === activeCourseId
  };
} 