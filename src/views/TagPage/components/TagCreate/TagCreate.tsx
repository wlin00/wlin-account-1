import { defineComponent, PropType, reactive, ref, onMounted, nextTick } from 'vue';
import { Icon } from '../../../../components/CustomIcon/Icon';
import { MainLayout } from '../../../../layout/MainLayout/MainLayout';
import s from './TagCreate.module.scss';
import { TagForm } from '../TagForm/TagForm'
import { useRouter } from 'vue-router';

export const TagCreate = defineComponent({
  setup: (props, context) => {
    // ref
    const router = useRouter()
    const isEdit = ref<boolean>(false)
    const loadFlag = ref<boolean>(false)
    const currentId = ref<string>('')

    // methods
    const handleIconClick = () => {
      router.push('/items/create')
    }

    const init = async () => {
      const id = router.currentRoute.value.query?.id
      if (id) {
        isEdit.value = true
        currentId.value = String(id)
      }
      await nextTick()
      loadFlag.value = true
    }

    onMounted(() => {
      init()
    })

    return () => (
      <MainLayout>{{
        title: () => `${isEdit.value ? '编辑' : '新建'}标签`,
        icon: () => <Icon name="left" onClick={handleIconClick} />,
        default: () => (<>
          {loadFlag.value && <TagForm 
            currentId={currentId.value}
            isEdit={isEdit.value}
          />}
        </>
        )
      }}</MainLayout>
    )
  }
})

export default TagCreate