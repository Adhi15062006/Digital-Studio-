const requiredPublicEnv = ['VITE_APP_ENV', 'VITE_APP_URL'] as const;

export function validateEnv() {
  const missing = requiredPublicEnv.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    throw new Error(message);
  }
}
