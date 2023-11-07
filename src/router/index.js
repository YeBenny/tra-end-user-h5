import { createRouter, createWebHashHistory } from 'vue-router'
import MySeriesView from '../views/MySeriesView.vue'
import MySeriesDetailView from '../views/MySeriesDetailView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MySeriesView
    },
    {
      path: '/my-series',
      name: 'my-series',
      component: MySeriesView
    },
    {
      path: '/my-series/:id',
      name: 'my-series-detail',
      component: MySeriesDetailView
    }
  ]
})

export default router
