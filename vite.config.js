import vue from '@vitejs/plugin-vue'
import {defineConfig, loadEnv} from 'vite'

export default defineConfig(({mode}) => {
    // 获取当前环境的配置
    const config = loadEnv(mode, './')
    return {
        base: './',
        plugins: [vue()],
        optimizeDeps: {
            include: ['schart.js']
        },
        server: {
            open: true, // 是否自动弹出浏览器页面
            host: "localhost",
            port: '3000',
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
    }
})


// export default {
//     base: './',
//     plugins: [vue()],
//     optimizeDeps: {
//         include: ['schart.js']
//     },
//     outputDir: 'dist',   //build输出目录
//     assetsDir: 'assets', //静态资源目录（js, css, img）
//     lintOnSave: false, //是否开启eslint
//     // devServer: {
//     //     open: true, //是否自动弹出浏览器页面
//     //     host: "localhost",
//     //     port: '3000',
//     //     proxy: {
//     //         '/api': {
//     //             target: 'http://localhost:8080', //API服务器的地址
//     //             changeOrigin: true,
//     //             ws: true,
//     //             pathRewrite: {
//     //                 '^/api': '/'
//     //             }
//     //         }
//     //     },
//     // }
//
//     server: {
//         open: true,//启动项目自动弹出浏览器
//         port: 3000,//启动端口
//         proxy: {
//             '/api': {
//                 target: config.,	//实际请求地址
//                 changeOrigin: true,
//                 rewrite: (path) => path.replace(/^\/api/, '')
//             },
//         }
//     }
//
// }


