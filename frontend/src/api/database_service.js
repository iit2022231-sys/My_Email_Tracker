// DEPRECATED: Use apiClient.js instead
// This file is kept for backward compatibility only
// All functionality has been moved to apiClient.js

import { resumeService as newResumeService } from './apiClient';
import apiClient from './apiClient';

export const resumeService = newResumeService;
export default apiClient;
