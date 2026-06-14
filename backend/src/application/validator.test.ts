import { validateCandidateData } from './validator';

describe('validateCandidateData', () => {
  it('accepts valid candidate data', () => {
    expect(() =>
      validateCandidateData({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '612345678',
      }),
    ).not.toThrow();
  });
});
