import s from './welcome.module.scss';
import { RouterLink } from 'vue-router';
import { FunctionalComponent } from 'vue';
import { SkipFeatures } from '../../../components/SkipFeatures/SkipFeatures';
import { CommonBottomWrap } from '../../../components/CommonBottomWrap/CommonBottomWrap';

export const ForthActions: FunctionalComponent = () => (<>
  <div class={s.actions}>
    <SkipFeatures class={s.fake}>跳过</SkipFeatures>
    <SkipFeatures>完成</SkipFeatures>
    <SkipFeatures class={s.fake}>跳过</SkipFeatures>
  </div>
  <CommonBottomWrap mode='welcome' />
</>)

ForthActions.displayName = 'ForthActions'