const mockCandidateSave = jest.fn();
const mockEducationSave = jest.fn();
const mockWorkExperienceSave = jest.fn();
const mockResumeSave = jest.fn();

const mockCandidateConstructor = jest.fn(function (this: any, data: any) {
  this.save = mockCandidateSave;
  this.education = [];
  this.workExperience = [];
  this.resumes = [];
});

const mockEducationConstructor = jest.fn(function (this: any, data: any) {
  this.save = mockEducationSave;
  this.candidateId = undefined;
});

const mockWorkExperienceConstructor = jest.fn(function (this: any, data: any) {
  this.save = mockWorkExperienceSave;
  this.candidateId = undefined;
});

const mockResumeConstructor = jest.fn(function (this: any, data: any) {
  this.save = mockResumeSave;
  this.candidateId = undefined;
});

jest.mock('../domain/models/Candidate', () => ({
  Candidate: mockCandidateConstructor,
}));

jest.mock('../domain/models/Education', () => ({
  Education: mockEducationConstructor,
}));

jest.mock('../domain/models/WorkExperience', () => ({
  WorkExperience: mockWorkExperienceConstructor,
}));

jest.mock('../domain/models/Resume', () => ({
  Resume: mockResumeConstructor,
}));

const { addCandidate } = require('../application/services/candidateService');

describe('candidateService.addCandidate', () => {
  const validCandidatePayload = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '612345678',
    address: '123 Main St',
    educations: [
      {
        institution: 'Example University',
        title: 'Computer Science',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
      },
    ],
    workExperiences: [
      {
        company: 'Acme Corp',
        position: 'Developer',
        description: 'Built software',
        startDate: '2022-02-01',
        endDate: '2023-02-01',
      },
    ],
    cv: {
      filePath: '/files/cv.pdf',
      fileType: 'application/pdf',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCandidateSave.mockResolvedValue({
      id: 1,
      firstName: validCandidatePayload.firstName,
      lastName: validCandidatePayload.lastName,
      email: validCandidatePayload.email,
    });
    mockEducationSave.mockResolvedValue({ id: 11 });
    mockWorkExperienceSave.mockResolvedValue({ id: 21 });
    mockResumeSave.mockResolvedValue({ id: 31 });
  });

  it('accepts a valid candidate payload and returns the saved candidate', async () => {
    const result = await addCandidate(validCandidatePayload);

    expect(mockCandidateConstructor).toHaveBeenCalledWith(validCandidatePayload);
    expect(mockCandidateSave).toHaveBeenCalledTimes(1);
    expect(mockEducationConstructor).toHaveBeenCalledWith(validCandidatePayload.educations[0]);
    expect(mockWorkExperienceConstructor).toHaveBeenCalledWith(validCandidatePayload.workExperiences[0]);
    expect(mockResumeConstructor).toHaveBeenCalledWith(validCandidatePayload.cv);
    expect(mockEducationSave).toHaveBeenCalledTimes(1);
    expect(mockWorkExperienceSave).toHaveBeenCalledTimes(1);
    expect(mockResumeSave).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: 1,
      firstName: validCandidatePayload.firstName,
      lastName: validCandidatePayload.lastName,
      email: validCandidatePayload.email,
    });
  });

  it('rejects invalid candidate payloads based on validation rules', async () => {
    const invalidPayload = {
      ...validCandidatePayload,
      email: 'invalid-email',
    };

    await expect(addCandidate(invalidPayload)).rejects.toThrow(/Invalid email/i);
    expect(mockCandidateConstructor).not.toHaveBeenCalled();
    expect(mockCandidateSave).not.toHaveBeenCalled();
  });

  it('persists candidate and nested entities after validation succeeds', async () => {
    await addCandidate(validCandidatePayload);

    expect(mockCandidateSave).toHaveBeenCalledTimes(1);
    expect(mockEducationSave).toHaveBeenCalledTimes(1);
    expect(mockWorkExperienceSave).toHaveBeenCalledTimes(1);
    expect(mockResumeSave).toHaveBeenCalledTimes(1);
  });

  it('saves education, work experience and resume with the generated candidateId', async () => {
    await addCandidate(validCandidatePayload);

    const educationInstance = mockEducationConstructor.mock.instances[0] as any;
    const workExperienceInstance = mockWorkExperienceConstructor.mock.instances[0] as any;
    const resumeInstance = mockResumeConstructor.mock.instances[0] as any;

    expect(educationInstance.candidateId).toBe(1);
    expect(workExperienceInstance.candidateId).toBe(1);
    expect(resumeInstance.candidateId).toBe(1);
  });

  it('translates Prisma unique constraint errors into a readable error message', async () => {
    mockCandidateSave.mockRejectedValue({ code: 'P2002' });

    await expect(addCandidate(validCandidatePayload)).rejects.toThrow(
      /The email already exists in the database/i,
    );
  });

  it('propagates unexpected database errors from the persistence layer', async () => {
    mockCandidateSave.mockRejectedValue(new Error('Database unavailable'));

    await expect(addCandidate(validCandidatePayload)).rejects.toThrow('Database unavailable');
  });
});
