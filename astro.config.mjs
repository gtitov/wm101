// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    redirects: {
        '/': '/chapters',
    },
    integrations: [starlight({
        title: 'Веб-картография',
        locales: {
            root: {
                label: 'Русский',
                lang: 'ru',
            }
        },
        social: {
            github: 'https://github.com/withastro/starlight',
        },
        sidebar: [
            {
                label: 'Введение в веб-картографию',
                autogenerate: { directory: 'chapters' },
            }
        ],
		}), react()],
});