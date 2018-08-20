import { Injectable } from '@angular/core';
import { User } from './server/rest-api.model';

export interface UserIdentity {
  id: number;
  fullName: string;
  email: string;
};

@Injectable()
export class CurrentUserService {

  private currentUser: UserIdentity;

  setUser(user: UserIdentity): void {
    this.currentUser = user;
  }

  get user(): UserIdentity {
    return this.currentUser ? this.currentUser : { id: undefined, fullName: '-', email: '-' };
  }

  get userId(): number {
    return this.currentUser ? this.currentUser.id : undefined;
  }

}
