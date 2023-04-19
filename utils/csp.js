const whitelist = [
  'self',
  'unsafe-inline',
  'data:',
  'blob:',
  'https://*.stripe.com',
  'https://*.mapbox.com',
  'https://*.cloudflare.com/',
  'https://bundle.js:*',
  'ws://localhost:*/',
  'https://*.jsdelivr.net',
];

const cspOptions = {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': whitelist,
      'worker-src': whitelist,
      'frame-src': whitelist,
      'img-src': whitelist,
      'connect-src': [
        ...whitelist,
        // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
      ],
    },
  },
};

export default cspOptions;
