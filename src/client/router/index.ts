import { createRouter, createWebHistory } from "vue-router";
import { useGameStore } from "@/client/store/gameStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "landing",
            component: () => import("@/client/views/LandingView.vue"),
        },
        {
            path: "/game",
            name: "game",
            component: () => import("@/client/views/GameView.vue"),
            beforeEnter: () => {
                // prevent navigating to game without an active session
                const gameStore = useGameStore();
                if (!gameStore.gameState) return { name: "landing" };
            },
        },
        {
            path: "/end",
            name: "end",
            component: () => import("@/client/views/EndView.vue"),
            beforeEnter: () => {
                // only reachable from game over state
                const gameStore = useGameStore();
                if (!gameStore.isGameOver) return { name: "landing" };
            },
        },
        {
            // redirect unknown routes to landing
            path: "/:pathMatch(.*)*",
            redirect: "/",
        },
    ],
});

export default router;
