import type { UpdateUserProfileDtoRequest } from './UpdateUserProfileRequest';
import type { UserProfileDtoResponse } from './UserProfileResponse';
import type { SignUpDtoRequest } from './signUpRequest';

export namespace UserDto {
  export interface User {}

  export import Request = SignUpDtoRequest;
  export import Response = UserProfileDtoResponse;
  export import UpdateRequest = UpdateUserProfileDtoRequest;
}
