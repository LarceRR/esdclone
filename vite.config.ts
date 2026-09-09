import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgx from '@svgx/vite-plugin-react'
import path from 'path'

// @ts-ignore
export default defineConfig(async () => {
    return {
        plugins: [react(), svgx()],
        resolve: {
            alias: [
                { find: '@', replacement: path.resolve(__dirname, 'src') },
                { find: '@public', replacement: path.resolve(__dirname, 'public/') },
            ],
        },
        server: {
            port: 3000,
            /** Доступ с телефона / другого ПК в LAN: http://<ваш-IP>:3000 */
            host: true,
        },
    }
})
