import s from './welcome.module.scss';
import { RouterLink } from 'vue-router';
import { FunctionalComponent } from 'vue';
import { SkipFeatures } from '../../../components/SkipFeatures/SkipFeatures';
import { CommonBottomWrap } from '../../../components/CommonBottomWrap/CommonBottomWrap';
export const SecondActions: FunctionalComponent = () => {
  return (
  <>
    <div class={s.actions}>
      <SkipFeatures class={s.fake}>跳过</SkipFeatures>
      <RouterLink to="/welcome/3" >下一页</RouterLink>
      <SkipFeatures>跳过</SkipFeatures>
    </div>
    <CommonBottomWrap mode='welcome' />
  </>)

}

SecondActions.displayName = 'FirstActions'
