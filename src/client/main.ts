import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/client/router";
import App from "@/client/ui/App.vue";
import "@/client/ui/assets/css/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
