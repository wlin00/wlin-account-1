import { defineComponent, PropType, reactive } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import s from './TagCreate.module.scss';
import { TagForm } from '../TagForm/TagForm'
import { useRouter } from 'vue-router';

export const TagCreate = defineComponent({
  setup: (props, context) => {
    // ref
    const router = useRouter()

    // methods
    const handleIconClick = () => {
      router.push('/items/create')
    }

    return () => (
      <MainLayout>{{
        title: () => '新建标签',
        icon: () => <Icon name="left" onClick={handleIconClick} />,
        default: () => (<>
          <TagForm />
        </>
        )
      }}</MainLayout>
    )
  }
})