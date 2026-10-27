import { Router } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  getLanguages,
  getLanguageById,
  getCourses,
  getCourseById,
  getLessonById,
  getLessonExercises,
  getProgress,
  completeLesson,
  getDictionary,
  getDictionaryItem,
  getCommunity,
  createContribution,
  getProfile,
  updateProfile,
} from '../controllers/apiControllers.js';

const router = Router();

// Apply auth middleware to all /api routes
router.use(authenticateUser);

// Auth verification
router.get('/auth/me', (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});

// Languages
router.get('/languages', getLanguages);
router.get('/languages/:id', getLanguageById);

// Courses
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);

// Lessons
router.get('/lessons/:id', getLessonById);
router.get('/lessons/:id/exercises', getLessonExercises);

// Learning Progress
router.get('/progress', getProgress);
router.post('/progress/complete-lesson', completeLesson);

// Digital Dictionary
router.get('/dictionary', getDictionary);
router.get('/dictionary/:id', getDictionaryItem);

// Community & Oral Traditions
router.get('/community', getCommunity);
router.post('/community/contributions', createContribution);

// Profile
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router;
