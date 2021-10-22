import vue from '@vitejs/plugin-vue'

export default {
    base: './',
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    },
}


// const path = require('path')
//
// export default {
//     // hostname: '0.0.0.0',
//     proxy: {
//         '/api': {
//             target: 'http://localhost:8080',
//             // ws: true,
//             changeOrigin: true,
//             // rewrite: path => path.replace(/^\/api/, ''),
//             secure: false,
//             pathRewrite: {
//                 '^/api': ''
//             }
//         },
//         changeOrigin: true
//     },
//     // proxy: 'http://localhost:8080/',
//     // changeOrigin: true,
//     base: './',
//     plugins: [vue()],
//     optimizeDeps: {
//         include: ['schart.js']
//     },
//     // server: {
//     //     port: 3000,
//     //     proxy: 'http://localhost:8080/',
//     //     changeOrigin: true
//     //     // proxy: {
//     //     //     '/api': {
//     //     //         target: 'https://www.baidu.com/',
//     //     //         ws: true,
//     //     //         changeOrigin: true,
//     //     //         pathRewrite: {
//     //     //             '^/api': ''
//     //     //         }
//     //     //     }
//     //     // }
//     // },
//     devServer: {
//         // proxy: 'http://localhost:8080/',
//         changeOrigin: true,
//         proxy: {
//             '/api': {
//                 target: 'http://localhost:8080',
//                 // ws: true,
//                 changeOrigin: true,
//                 // rewrite: path => path.replace(/^\/api/, ''),
//                 secure: false,
//                 pathRewrite: {
//                     '^/api': ''
//                 }
//             },
//             changeOrigin: true
//         },
//     },
//
// }
