// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    redirects: {
        '/': '/chapters',
    },
    integrations: [
        starlight({
            title: 'Веб-картография',
            description: 'Веб-картография и веб-картографирование: практическое пособие',
            head: [
                {
                    tag: 'script',
                    attrs: {
                        src: "//gc.zgo.at/count.js",
                        'data-goatcounter': "https://webcartography.goatcounter.com/count",
                        async: true
                    }
                }
            ],
            locales: {
                root: {
                    label: 'Русский',
                    lang: 'ru',
                }
            },
            sidebar: [
                {
                    label: 'Введение в веб-картографию',
                    autogenerate: { directory: 'chapters' },
                }
            ],
            components: {}
        }),
        react()
    ],
});