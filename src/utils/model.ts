import type { User } from '../types';

export function hasName(user: Pick<User, 'first_name'> | null | undefined) {
  return user?.first_name;
}

export function getNameOrEmail(
  user: Pick<User, 'first_name' | 'last_name' | 'email'>
) {
  if (user.first_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  } else {
    return user.email;
  }
}
