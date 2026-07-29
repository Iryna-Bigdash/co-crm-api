export function getPublicApiUrl(): string {
  const url = process.env.API_PUBLIC_URL?.replace(/\/$/, '');
  if (url) {
    return url;
  }

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}`;
  }

  throw new Error('API_PUBLIC_URL is required in production');
}
