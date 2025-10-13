This folder contains candidate-facing pages for profile management, resume upload, questionnaires, and interview details.

Implementation notes:
- Validation: Basic validators provided in src/utils/validators.js.
- API: src/services/candidateService.js uses apiClient with mock responses when REACT_APP_ENABLE_MOCKS=true (default). Replace with real endpoints later.
- File upload: The FileUpload component currently sends file metadata via JSON to the mock API. When connecting to a real backend, switch to multipart/form-data in candidateService.uploadResume and attach Authorization header from apiClient.
- Routes are wired under Candidate layout:
  /candidate/profile
  /candidate/resume
  /candidate/questionnaire
  /candidate/interviews
  /candidate/interviews/:interviewId
