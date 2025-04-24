import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: '/',
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: 'openid email offline_access',
      },
    });
  },
  async logout(req, res) {
    await handleLogout(req, res, {
      returnTo: '/login',
    });
  },
});
