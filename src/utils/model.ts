export function hasName(user) {
  return user?.first_name;
}

export function getNameOrEmail(user) {
  if (user.first_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  } else {
    return user.email;
  }
}
