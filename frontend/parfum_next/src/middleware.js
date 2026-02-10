import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'tk'],
  defaultLocale: 'ru'
});

export const config = {
  matcher: ['/', '/(ru|tk)/:path*']
};
