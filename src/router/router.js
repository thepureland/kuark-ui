import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/msg/myMsg",
                name: "myMsg",
                meta: {
                    title: '我的消息'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/start",
                name: "startFlow",
                meta: {
                    title: '发起流程'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/my",
                name: "myFlow",
                meta: {
                    title: '我的流程'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/unclaimTask",
                name: "unclaimTask",
                meta: {
                    title: '待签收任务'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/todoTask",
                name: "todoTask",
                meta: {
                    title: '待办任务'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/finishedTask",
                name: "finishedTask",
                meta: {
                    title: '已办任务'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/flow/definition",
                name: "flowDefinition",
                meta: {
                    title: '流程定义'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/wf/flow/definition/FlowDefinitionList.vue")
            }, {
                path: "/flow/form",
                name: "flowForm",
                meta: {
                    title: '表单定义'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/auth/role",
                name: "role",
                meta: {
                    title: '角色管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/rbac/role/RoleList.vue")
            }, {
                path: "/auth/group",
                name: "group",
                meta: {
                    title: '组管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/rbac/group/UserGroupList.vue")
            }, {
                path: "/rbac/resourcepermission",
                name: "resourcepermission",
                meta: {
                    title: '资源权限'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/rbac/resourcepermission/ResourcePermissionList.vue")
            }, {
                path: "/user/account",
                name: "user",
                meta: {
                    title: '用户账号'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/user/account/AccountList.vue")
            }, {
                path: "/sys/res",
                name: "res",
                meta: {
                    title: '资源管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/resource/ResourceList.vue")
            }, {
                path: "/sys/dict",
                name: "dict",
                meta: {
                    title: '字典管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/dict/DictList.vue")
            }, {
                path: "/sys/param",
                name: "param",
                meta: {
                    title: '参数管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/param/ParamList.vue")
            }, {
                path: "/sys/datasource",
                name: "datasource",
                meta: {
                    title: '数据源管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/datasource/DatasourceList.vue")
            }, {
                path: "/sys/tenant",
                name: "tenant",
                meta: {
                    title: '租户管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/tenant/TenantList.vue")
            }, {
                path: "/user/org",
                name: "org",
                meta: {
                    title: '组织机构'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/user/organization/OrganizationList.vue")
            }, {
                path: "/sys/domain",
                name: "domain",
                meta: {
                    title: '域名管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/domain/DomainList.vue")
            }, {
                path: "/sys/cache",
                name: "cache",
                meta: {
                    title: '缓存管理'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/sys/cache/CacheList.vue")
            }, {
                path: "/geo/country",
                name: "country",
                meta: {
                    title: '国家地区'
                },
                // component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }
        ]
        // children: [
        //     {
        //         path: "/dashboard",
        //         name: "dashboard",
        //         meta: {
        //             title: '系统首页'
        //         },
        //         component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
        //     }, {
        //         path: "/table",
        //         name: "basetable",
        //         meta: {
        //             title: '表格'
        //         },
        //         component: () => import ( /* webpackChunkName: "table" */ "../views/BaseTable.vue")
        //     }, {
        //         path: "/charts",
        //         name: "basecharts",
        //         meta: {
        //             title: '图表'
        //         },
        //         component: () => import ( /* webpackChunkName: "charts" */ "../views/BaseCharts.vue")
        //     }, {
        //         path: "/form",
        //         name: "baseform",
        //         meta: {
        //             title: '表单'
        //         },
        //         component: () => import ( /* webpackChunkName: "form" */ "../views/BaseForm.vue")
        //     }, {
        //         path: "/tabs",
        //         name: "tabs",
        //         meta: {
        //             title: 'tab标签'
        //         },
        //         component: () => import ( /* webpackChunkName: "tabs" */ "../views/Tabs.vue")
        //     }, {
        //         path: "/donate",
        //         name: "donate",
        //         meta: {
        //             title: '鼓励作者'
        //         },
        //         component: () => import ( /* webpackChunkName: "donate" */ "../views/Donate.vue")
        //     }, {
        //         path: "/permission",
        //         name: "permission",
        //         meta: {
        //             title: '权限管理',
        //             permission: true
        //         },
        //         component: () => import ( /* webpackChunkName: "permission" */ "../views/Permission.vue")
        //     }, {
        //         path: "/i18n",
        //         name: "i18n",
        //         meta: {
        //             title: '国际化语言'
        //         },
        //         component: () => import ( /* webpackChunkName: "i18n" */ "../views/I18n.vue")
        //     }, {
        //         path: "/upload",
        //         name: "upload",
        //         meta: {
        //             title: '上传插件'
        //         },
        //         component: () => import ( /* webpackChunkName: "upload" */ "../views/Upload.vue")
        //     }, {
        //         path: "/icon",
        //         name: "icon",
        //         meta: {
        //             title: '自定义图标'
        //         },
        //         component: () => import ( /* webpackChunkName: "icon" */ "../views/Icon.vue")
        //     }, {
        //         path: '/404',
        //         name: '404',
        //         meta: {
        //             title: '找不到页面'
        //         },
        //         component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
        //     }, {
        //         path: '/403',
        //         name: '403',
        //         meta: {
        //             title: '没有权限'
        //         },
        //         component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
        //     }, {
        //         path: '/user',
        //         name: 'user',
        //         meta: {
        //             title: '个人中心'
        //         },
        //         component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
        //     }, {
        //         path: '/editor',
        //         name: 'editor',
        //         meta: {
        //             title: '富文本编辑器'
        //         },
        //         component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
        //     }
        // ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | kuark-ui`;
    const role = localStorage.getItem('current_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;