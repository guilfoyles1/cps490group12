import { createRouter, createWebHistory } from 'vue-router';
import ChatComponent from '../components/ChatComponent.vue';  // Updated import to ChatComponent.vue
import NewChat from '../components/NewChat.vue';

const routes = [
  { path: '/', name: 'Chat', component: ChatComponent },  // Updated component to ChatComponent
  { path: '/new-chat', name: 'NewChat', component: NewChat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
