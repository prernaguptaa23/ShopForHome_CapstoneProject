import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AccountService } from '../core/services/account';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let accountService: jasmine.SpyObj<AccountService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const accountSpy = jasmine.createSpyObj('AccountService', ['isLoggedIn', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AccountService, useValue: accountSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the guard', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if logged in', () => {
    accountService.isLoggedIn.and.returnValue(true);
    accountService.getUserRole.and.returnValue('User');

    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should navigate to login if not logged in', () => {
    accountService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/account/login']);
  });
});
