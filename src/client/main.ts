import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/client/router";
import App from "@/client/App.vue";
import "@/client/assets/css/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
