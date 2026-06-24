import {
  loadRefreshToken,
  refreshAccessToken,
  clearRefreshToken,
  deviceLogin,
} from "./lib/auth";

export async function bootstrap(): Promise<{ accessToken: string }> {
  const storedRefreshToken = await loadRefreshToken();

  if (storedRefreshToken) {
    try {
      const accessToken = await refreshAccessToken(storedRefreshToken);
      return { accessToken };
    } catch (error) {
      await clearRefreshToken();
    }
  }

  const newRefreshToken = await deviceLogin();
  const accessToken = await refreshAccessToken(newRefreshToken);
  return { accessToken };
}
