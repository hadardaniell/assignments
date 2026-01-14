import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});