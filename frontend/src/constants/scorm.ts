/**
 * Lesson Status Constants
 *
 * These constants define the standardized SCORM lesson status states that can be used
 * to track the learner's progress through the course content.
 */
export const LESSON_STATUS = {
  /** The lesson has not been attempted */
  notAttempted: 'not attempted' as const,
  /** The lesson has been started but not completed */
  incomplete: 'incomplete' as const,
  /** The lesson has been completed */
  completed: 'completed' as const,
  /** The lesson has been passed */
  passed: 'passed' as const,
  /** The lesson has been failed */
  failed: 'failed' as const,
} as const;
