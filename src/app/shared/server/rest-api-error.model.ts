import { HttpErrorResponse } from '@angular/common/http';

import { Messages } from "../messages";

interface ValidationError {
  property: string;
  message: string;
}

export class RestApiError {

  private error: string;
  private reason: string;
  private reasonParams: Array<string>;
  private validationErrors: Array<ValidationError>;

  constructor(errorResponse: HttpErrorResponse) {
    if (!errorResponse) {
      this.error = Messages.ERROR_UNKNOWN;
      this.reason = Messages.REASON_UNKNOWN;
    } else if (errorResponse.error instanceof ErrorEvent) {
      this.error = Messages.ERROR_FORBIDDEN;
      this.reason = Messages.REASON_SERVER_UNREACHABLE;
    } else if (errorResponse.status === 0) {
      this.error = Messages.ERROR_FORBIDDEN;
      this.reason = Messages.REASON_SERVER_UNREACHABLE;
    } else {
      const data: any = errorResponse.error;
      if (!data) {
        this.error = Messages.ERROR_UNKNOWN;
        this.reason = Messages.REASON_UNKNOWN;
      } else if (errorResponse.status === 400) {
        this.validationErrors = data;
      } else {
        this.error = data.error;
        this.reason = data.reason;
        this.reasonParams = data.reasonParams;
      }
    }
  }

  isValidataionError(): boolean {
    return this.validationErrors && this.validationErrors.length > 0;
  }

  getFirstValidationError(): string {
    const ve = this.validationErrors[0];
    return Messages.getProperty(ve.property) + ' - ' + Messages.get(ve.message);
  }

  getError(): string {
    return Messages.get(this.error);
  }

  getReason(): string {
    return Messages.get(this.reason);
  }

  private isError(error: string): boolean {
    return this.error === error;
  }

  private isReason(reason: string): boolean {
    return this.reason === reason;
  }

  isForbidden(): boolean {
    return this.isError(Messages.ERROR_FORBIDDEN);
  }

  isInvalidPassword(): boolean {
    return this.isForbidden() && this.isReason(Messages.AUTH_INCORRECT_PASSWORD);
  }

}