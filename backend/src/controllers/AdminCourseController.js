
import courseUsecase from '../usecases/courseUsecase.js';

const fetchCourses = async (req, res) => {
    const { page = 1, search = '' } = req.query;
    try {
        console.log("hi");
        
        const { courses, totalPages } = await courseUsecase.fetchAllCoursesForAdmin({ page: Number(page), searchTerm: search });
        
        res.status(200).json({ data: courses, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const blockCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const updatedCourse = await courseUsecase.blockCourseById(courseId);
        res.status(200).json({ message: 'Course blocked successfully', data: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unblockCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const updatedCourse = await courseUsecase.unblockCourseById(courseId);
        res.status(200).json({ message: 'Course unblocked successfully', data: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {fetchCourses,blockCourse,unblockCourse}