import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function accessToken(req, res) {
  try {
    const accessToken = await getSession(req, res);
    return res.json(accessToken);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});
