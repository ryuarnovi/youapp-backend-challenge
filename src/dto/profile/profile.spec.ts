import { Profile } from './profile.dto';

describe('Profile', () => {
  it('should be defined', () => {
    expect(new Profile()).toBeDefined();
  });
});
