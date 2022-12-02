import { defineComponent, PropType, reactive } from 'vue';
import { Button } from '../../../../components/Button/Button';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import s from './TagEdit.module.scss';
import { TagForm } from '../TagForm/TagForm'

export const TagEdit = defineComponent({
  setup: (props, context) => {
    // ref

    // methods
    const handleIconClick = () => {}

    return () => (
      <MainLayout>{{
        title: () => '编辑标签',
        icon: () => <Icon name="left" onClick={handleIconClick} />,
        default: () => (<>
          <TagForm />
          <div class={s.actions}>
            <Button level='danger' class={[s.actions_btn, s.removeTags]} onClick={() => { }}>删除标签</Button>
            <Button level='danger' class={[s.actions_btn, s.removeTagsAndItems]} onClick={() => { }}>删除标签和记账</Button>
          </div>
        </>
        )
      }}</MainLayout>
    )
  }
})