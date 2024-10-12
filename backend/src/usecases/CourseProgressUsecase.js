
import { createProgress, findCourseProgressByUserId, findUserCourseById, getProgressByUserAndCourse, updateProgress } from '../repositories/CourseRepository.js';

const markContentAsComplete = async (userId, courseId, contentId) => {
  let progress = await getProgressByUserAndCourse(userId, courseId);

  const course = await findUserCourseById(courseId);
  const totalLessons = course.contents.length;
  if (!progress) {

    progress = await createProgress({
      userId,
      courseId,
      completedLessons: [contentId],
      currentLesson: contentId,
      progress: (1 / totalLessons) * 100, 
    });
  } else if (!progress.completedLessons.includes(contentId)) {

    progress.completedLessons.push(contentId);
    progress.currentLesson = contentId;

    const completedCount = progress.completedLessons.length;
    progress.progress = (completedCount / totalLessons) * 100;

    await updateProgress(progress._id, progress);
  }

  return progress;
};
const getUserCourseProgress = async (userId) => {
    return await findCourseProgressByUserId(userId);
  };
export {markContentAsComplete,getUserCourseProgress}