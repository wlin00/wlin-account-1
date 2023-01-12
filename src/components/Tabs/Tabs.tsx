import { defineComponent, PropType } from 'vue';
import s from './Tabs.module.scss';
import { Icon } from '../CustomIcon/Icon';

export const Tabs = defineComponent({
  props: {
    value: {
      type: String,
      default: 'expense'
    },
    classPrefix: {
      type: String
    },
    useLazy: Boolean
  },
  emits: ['change', 'input', 'iconClick'],
  setup: (props, context) => {
    return () => {
      const { slots } = context
      const tabs = slots.default?.()
      if (!tabs?.length) {
        return () => null
      }
      for (let i = 0; i < tabs.length; i++) { // tabs[i].type 就是Tab组件，即一个defineComponent的实例
        if (tabs[i].type !== Tab) {
          console.log('tabs[i]', tabs[i])
          throw new Error('<Tabs> only accepts <Tab> as children')
        }
      }
      const classPrefix = props.classPrefix

      const handleTabChange = (item: any) => {
        // if (item.props.code === props.value) {
        //   return
        // }
        context.emit('input', item.props.code)
      }

      const handleIconClick = (e: Event, icon: string) => {
        e.stopPropagation()
        context.emit('iconClick', icon)
      }

      return (<div class={[s.tabs, classPrefix + '_tabs']}>
        <ol class={[s.tabs_nav, classPrefix + '_tabs_nav']}> {/* Tabs导航 */}
          { 
            tabs.map((item: any) => {
              return (
              <li 
                key={item.props.code}
                class={[item.props.code === props.value ? s.selected : '', classPrefix + '_tabs_nav_item', s.tab_nav]}
                onClick={() => handleTabChange(item)}
              >
                <span>{item.props.name}</span>
                { item.props?.navIcon ? <Icon onClick={(e: Event) => handleIconClick(e, item.props.navIcon)} name={item.props.navIcon} class={s.icon} /> : <span></span> }
              </li>
            )
          })
          }
        </ol>
        {props.useLazy ? <div> {/* Tabs选中区域 - 懒渲染（只渲染选中tab） */}
          { tabs.find((item: any) => item.props.code === props.value) }
        </div> :
        <div> {/* Tabs选中区域 - 默认渲染（渲染全部tab，只有选中项显示） */}
          { tabs.map((item: any) => <div v-show={item.props.code === props.value}>{item}</div>) }
        </div>}
      </div>)
    }
  }
})

export const Tab = defineComponent({
  props: {
    name: String,
    code: String,
    navIcon: String
  },
  setup: (props, context) => {
    const { slots } = context
    return () => (
      <div>{
        slots.default?.()          
      }</div>
    )
  }
})