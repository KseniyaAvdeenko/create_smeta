function requireAuth(authService) {
  const user = authService.getCurrentUser();
  if (!user) {
    throw new Error('Требуется авторизация');
  }
  return user;
}

module.exports = { requireAuth };
