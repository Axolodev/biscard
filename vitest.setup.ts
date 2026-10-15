import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

// @testing-library/react's auto-cleanup only registers itself when it finds
// a global `afterEach` (i.e. `test.globals: true`). This project doesn't
// enable test globals, so register cleanup explicitly instead.
afterEach(() => {
  cleanup();
});
