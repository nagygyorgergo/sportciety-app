import { TestBed } from '@angular/core/testing';

import { PersonalBestsService } from './personal-bests.service';

describe('PersonalBestsService', () => {
  let service: PersonalBestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalBestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
