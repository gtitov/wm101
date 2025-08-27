// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Практическое введение в веб-картографию',
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
            components: {}
        }),
        react()
    ],
});