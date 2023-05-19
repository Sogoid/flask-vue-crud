import {createRouter, createWebHistory} from "vue-router";
import Books from "../components/Books.vue";
import Ping from "../components/Ping.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Books",
            component: Books,
        },
        {
            path: "/ping",
            name: "ping",
            component: Ping,
        },
        /* {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }*/
    ],
});

export default router;
