import s from './welcome.module.scss';
import { RouterLink } from 'vue-router';
import { FunctionalComponent } from 'vue';
import { SkipFeatures } from '../../../components/SkipFeatures/SkipFeatures';
export const ThirdActions: FunctionalComponent = () => {
  return <div class={s.actions}>
    <SkipFeatures class={s.fake}>跳过</SkipFeatures>
    <RouterLink to="/welcome/4" >下一页</RouterLink>
    <SkipFeatures>跳过</SkipFeatures>
  </div>
}

ThirdActions.displayName = 'ThirdActions'
