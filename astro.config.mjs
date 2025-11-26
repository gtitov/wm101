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
                        type: "text/javascript",
                        async: true
                    },
                    content: "(function(m,e,t,r,i,k,a){         m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};         m[i].l=1*new Date();         for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}         k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)     })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105524700', 'ym');      ym(105524700, 'init', {ssr:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});"
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