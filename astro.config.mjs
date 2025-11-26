// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import logoLight from './public/logo-light.png';


console.log(logoLight)
// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Практическое введение в веб-картографию',
            logo: {
                dark: '/public/logo-dark.png',
                light: '/public/logo-light.png',
                alt: 'Практическое введение в веб-картографию',
                replacesTitle: true
            },
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
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:image', content: "/logo-light.png" },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:image', content: "/logo-light.png" },
                }
            ],
            locales: {
                root: {
                    label: 'Русский',
                    lang: 'ru',
                }
            },
            components: {
                Sidebar: './src/components/Sidebar.astro',
            },
            sidebar: [
                'index',
                'intro',
                '1-web-map',
                '2-api',
                '3-backend',
                '4-tiles',
                'what-next',
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
        })
    ],
});