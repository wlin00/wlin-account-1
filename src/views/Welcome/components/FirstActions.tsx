import s from './welcome.module.scss';
import { RouterLink } from 'vue-router';
import { FunctionalComponent } from 'vue';
import { SkipFeatures } from '../../../components/SkipFeatures/SkipFeatures';
export const FirstActions: FunctionalComponent = () => {
  return <div class={s.actions}>
    <SkipFeatures class={s.fake}>跳过</SkipFeatures>
    <RouterLink to="/welcome/2" >下一页</RouterLink>
    <SkipFeatures>跳过</SkipFeatures>

  </div>
}

FirstActions.displayName = 'FirstActions'
