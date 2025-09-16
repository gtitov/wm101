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
            favicon: '/icon.png',
            head: [
                {
                    tag: 'script',
                    attrs: {
                        src: "//gc.zgo.at/count.js",
                        'data-goatcounter': "https://webcartography.goatcounter.com/count",
                        async: true
                    }
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'icon',
                        href: '/favicon.ico',
                        sizes: '32x32',
                    },
                }
            ],
            locales: {
                root: {
                    label: 'Русский',
                    lang: 'ru',
                }
            },
            components: {
                SiteTitle: './src/components/SiteTitle.astro',
                Sidebar: './src/components/Sidebar.astro',
            },
            sidebar: [
                'index',
                '1-web-map',
                '2-api',
                '3-backend',
                '4-tiles',
                // 'what-next',
                '99-references',
                {
                    label: 'Внеклассное чтение',
                    autogenerate: {
                        directory: 'extra',
                        collapsed: true
                    }
                }
            ],
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/gtitov/wm101' },
            ]
        }),
        react()
    ],
});