import { defineComponent, Transition, VNode } from "vue";
import { RouteLocationNormalizedLoaded, RouterView } from "vue-router";
import "./App.scss"
import { CommonBottomWrap } from './components/CommonBottomWrap/CommonBottomWrap';

export const App = defineComponent({
  setup() {
    return () => (
      <div class="page">
        <RouterView />
      </div>
    )
  }
})