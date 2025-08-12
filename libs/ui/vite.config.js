import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SkyScoutUI',
            formats: ['es', 'umd'],
            fileName: format => `skyscout-ui.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
