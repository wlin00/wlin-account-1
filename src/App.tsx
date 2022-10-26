import { defineComponent, ref } from 'vue';
export const App = defineComponent({
  setup: (props, context) => {
    return () => (<>
      <header>导航
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
        </ul> 
      </header>
      <div>
        <RouterView />
      </div>
      <footer>页脚</footer>
    </>)
  }
})