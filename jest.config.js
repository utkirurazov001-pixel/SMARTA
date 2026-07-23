module.exports = {
  preset: 'jest-expo',
  // Faqat *.test.ts(x) fayllar test hisoblanadi — __tests__/support ichidagi
  // yordamchilar (nodeSqlite, freshDb) test sifatida ishga tushmaydi.
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|i18next|react-i18next))',
  ],
};
