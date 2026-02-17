/**
 * Vitest global setup — provides a clean localStorage mock before each test.
 */

import { beforeEach } from 'vitest';

beforeEach(() => {
    localStorage.clear();
});
