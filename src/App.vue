<template>
  <div class="grid">
    <div class="grid-layout">
      <GridGroup :data="users" v-for="(users, index) in groups" :key="index">
      </GridGroup>
      <GridLog></GridLog>
      <GridScroll></GridScroll>
      <GridHighlight></GridHighlight>
    </div>
  </div>
  <GridBack></GridBack>
</template>

<script setup lang="ts" name="App">
import {
  defineComponent,
  type PropType,
  h,
  computed,
  ref,
  unref,
  onMounted
} from 'vue'
import { useUserGroup, type User } from '@/utils'
/**
 * 用户组件
 */
const GridUser = defineComponent({
  name: 'GridUser',
  props: {
    data: {
      type: Object as PropType<User>
    },
    /**
     * 是否允许拖拽-默认false
     */
    draggable: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props, { slots }) {
    // 开始拖拽
    const dragstart = (event: DragEvent) => {
      event.dataTransfer?.setData('userData', JSON.stringify(props.data))
    }
    const svgToBase64 = (svg: string) => {
      if (svg.startsWith('<svg')) {
        return `url("data:image/svg+xml;base64,${btoa(
          decodeURIComponent(encodeURIComponent(svg))
        )}")`
      } else {
        return `url(${svg})`
      }
    }
    return () =>
      h(
        'a',
        {
          class: 'grid-user',
          href: props.data?.url || 'javascript:void(0)',
          target: props.data?.url && '_blank',
          draggable: props.draggable,
          style: {
            backgroundColor: props?.data?.icon && 'transparent',
            backgroundImage: props?.data?.icon && svgToBase64(props.data.icon)
          },
          onDragstart: dragstart
        },
        slots.default && slots.default()
      )
  }
})
const GridBanner = defineComponent({
  name: 'GridBanner',
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => null
    }
  },
  setup(props) {
    const desc = computed(() =>
      [props.data.name, ...(props?.data?.status || [])].join('\t|\t')
    )

    const title = ref(desc.value)
    const cChildren = computed(() => props.data.children || [])
    const cStatus = computed(() => {
      return title.value
    })
    const onMouseenter = (user: User) => {
      title.value = [user.name].join('\t|\t')
    }
    const onMouseleave = () => {
      title.value = desc.value
    }
    return () =>
      h(
        'div',
        {
          class: 'grid-banner'
        },
        [
          h(
            'div',
            {
              class: 'grid-banner-content'
            },
            cChildren.value?.map((user) =>
              h(GridUser, {
                data: user,
                draggable: false,
                onMouseleave,
                onMouseenter: () => onMouseenter(user)
              })
            )
          ),
          h(
            'div',
            {
              class: 'grid-banner-status'
            },
            cStatus.value
          )
        ]
      )
  }
})

const GridMain = defineComponent({
  name: 'GridMain',
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => null
    }
  },
  setup(props) {
    const oData = ref(props.data)
    const cData = computed(() => oData.value)
    const dragover = (event: DragEvent) => {
      event.preventDefault()
    }

    const drop = (event: DragEvent) => {
      event.preventDefault()
      let strData: any = event.dataTransfer?.getData('userData')
      let sData = JSON.parse(strData) as User
      if (sData.group == props.data.group) {
        oData.value = sData
      }
    }
    return () =>
      h(
        'div',
        {
          class: ['grid-main'],
          onDragover: dragover,
          onDrop: drop
        },
        [
          h(GridUser, {
            data: unref(cData.value),
            draggable: false,
            style: {
              gridArea: '1/1/span 2/span 2'
            }
          }),
          h(GridBanner, {
            data: unref(cData.value),
            style: {
              gridArea: '1/3/span 2/-1'
            }
          })
        ]
      )
  }
})
const GridGroup = defineComponent({
  name: 'GridGroup',
  props: {
    /**
     * 对象数组
     */
    data: {
      type: Array as PropType<User[]>,
      default: () => []
    }
  },
  setup(props) {
    const cData = computed(() => props.data)
    return () =>
      h(
        'div',
        {
          class: 'grid-group'
        },
        [
          h(GridMain, {
            data: cData.value[0]
          }),
          cData.value.map((user) =>
            h(GridUser, {
              data: user
            })
          )
        ]
      )
  }
})

const GridLog = defineComponent({
  name: 'GridLog',
  setup(props, ctx) {
    const logs = ref([
      {
        label: 'Linux授权',
        value: 'chmod -R 755'
      },
      {
        label: 'Linux下zip文件解压乱码',
        value: 'unzip -O cp936'
      },
      {
        label: 'All My People',
        value: '哪有小孩天天哭，哪有赌徒天天输！领域展开，坐杀搏徒。'
      },
      {
        label: '君子爱财，取之有道。',
        value: '我喜欢钱，所以拿走你的钱，这是很有道理的！'
      },
      {
        label: '既来之，则安之。',
        value: '既然来到了这里，那么就安葬在这里吧。'
      },
      {
        label: '文字轮播与图片轮播',
        value: '巧用逐帧动画，配合补间动画实现一个无限循环的轮播效果',
        url: 'https://github.com/chokcoco/iCSS/issues/184'
      },
      {
        label: '设置元素圆角',
        value: 'overflow: clip;overflow-clip-margin: content-box;'
      },
      {
        label: '自定义高亮--Css Custom Highlight API',
        value: '可以在不改变 dom 结构的情况下自定义任意文本的样式',
        url: 'https://juejin.cn/post/7199438741533376573'
      },
      {
        label: 'clamp用于生成动态范围的函数',
        value: 'clamp()函数会返回这三个值中的中间值作为最终结果',
        url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/clamp'
      }, {
        label: 'saewd047@gmail.com',
        value: 'abc334422'
      }
    ])
    return () =>
      h(
        'div',
        {
          class: 'grid-log'
        },
        [
          h('div', { class: 'grid-log-progress' }),
          h(
            'div',
            { class: 'grid-log-content' },
            logs.value.map((item) =>
              h('div', { class: 'grid-log-item' }, [
                h('div', { class: 'grid-log-label' }, item.label),
                h('div', { class: 'grid-log-value' }, item.value)
              ])
            )
          )
        ]
      )
  }
})

const GridHighlight = defineComponent({
  name: 'GridHighlight',
  setup(props, ctx) {
    const oRef = ref<HTMLElement | undefined>(undefined)

    onMounted(() => {
      // 清除上个高亮
      // @ts-ignore
      CSS.highlights.clear();
      // @ts-ignore
      if (CSS.highlights) {
        const range = new Range()
        range.setStart(oRef.value!, 0);
        range.setEnd(oRef.value!, 1);
        // @ts-ignore
        const highlight = new Highlight(range)
        // @ts-ignore
        CSS.highlights.set('color1', highlight)
      }
    })
    return () => h('div', { class: 'grid-highlight', ref: oRef }, 'abc')
  }
})

const GridScroll = defineComponent({
  name: 'GridScroll',
  props: {
    speed: {
      type: Number,
      default: () => 2
    }
  },
  setup(props, ctx) {
    const data = ref(['HTML', 'CSS', 'JS', 'Animation', 'UI/UX', '哈哈哈', '喜喜'])
    return () =>
      h(
        'div',
        {
          class: 'grid-scroll', style: {
            '--speed': props.speed + 's', '--num': data.value.length
          }
        },
        h(
          'div',
          { class: 'grid-scroll-content' },
          [data.value.map((item) =>
            h('div', { class: 'grid-scroll-item' }, item)
          ),
          h('div', { class: 'grid-scroll-item' }, data.value[0])
          ]
        )
      )
  }
})

const GridBack = defineComponent({
  name: 'GridBack',
  setup() {
    const onClick = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    return () => h('div', { class: 'grid-back', onClick })
  }
})

const groups = ref<Record<string, User[]>>()
let token = 'ghp_XXXXsp8WlTftjAdHIbXXXXhAXecvvMEbXXXXPS3c6k2cvSV7'
onMounted(() => {
  let lUsers: any = localStorage.getItem('users')
  if (lUsers) {
    lUsers = JSON.parse(lUsers)
    groups.value = useUserGroup(lUsers)
  }
  let lUpdateAt: any = localStorage.getItem('updated_at')
  if (lUpdateAt) {
    lUpdateAt = Number(lUpdateAt)
  }
  let sUpdateAt = 0
  fetch('https://api.github.com/repos/chendj001/v3css/issues/1/comments', {
    headers: {
      Authorization: `token ${token.replace(/XXXX/gm, '')}`
    },
    cache: 'no-cache'
  })
    .then((res) => res.json())
    .then((res) => {
      let oList: any = []
      let updateList: any = []
      res.map((item: any) => {
        updateList.push(new Date(item.updated_at || item.created_at).getTime())
        try {
          oList.push(new Function(`return ${item.body}`)())
        } catch (error) {
          console.log('出错了', item)
        }
      })
      sUpdateAt = Math.max(...updateList)
      if (sUpdateAt > lUpdateAt) {
        groups.value = useUserGroup(oList)
        localStorage.setItem('users', JSON.stringify(oList))
        localStorage.setItem('updated_at', sUpdateAt + '')
        console.log('更新了')
      }
      // show.value = true;
    })
})
</script>

<style lang="scss">
// 元素大小
$size: 36px;
// 间距
$gap: 5px;
// 内边距
$padding: 10px;
// 卡片宽度
$width: $size * 7 + $gap * (7-1) + $padding * 2;
// 卡片高度
$height: $size * 3 + $gap * (3-1) + $padding * 2;

.grid {
  container-type: inline-size;
  padding-top: 20px;

  &-layout {
    display: grid;
    grid-template-columns: repeat(1, $width);
    justify-content: center;
    color: #fff;
    gap: $gap * 2;
    @include ContainerGrid($width, 4, $gap, 10px);
  }

  &-group {
    width: $width;
    height: $height;
    background: rgba($theme, 0.16);
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: $gap;
    padding: $padding;
  }

  &-log {
    width: $width;
    height: $height;
    background: rgba($theme, 0.16);
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    position: relative;
    scroll-behavior: smooth;
    overflow-y: auto;
    scroll-timeline: --gridLog y;

    // overflow: clip;
    // overflow-clip-margin: content-box;
    &::-webkit-scrollbar {
      display: none;
    }

    &-progress {
      position: sticky;
      height: 4px;
      left: 0;
      top: 0;
      width: 100%;
      background: green;
      transform-origin: 0 50%;
      animation: auto grow-progress linear forwards;
      animation-timeline: --gridLog;
    }

    &-content {
      padding: 10px;
    }

    &-item {
      background-color: rgba(#fff, 0.5);
      padding: 5px 10px;
      margin-bottom: 10px;
      border-radius: 6px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-label {
      margin-bottom: 5px;
      user-select: none;
      font-size: 14px;
    }

    &-value {
      font-weight: bold;
    }
  }

  &-scroll {
    width: $width;
    height: $size;
    background: rgba($theme, 0.16);
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    position: relative;
    overflow: hidden;
    --speed: 2s;
    --num: 0;
    // mask: linear-gradient(90deg,
    //     transparent,
    //     white 20%,
    //     white 80%,
    //     transparent);


    &-content {
      overflow: hidden;
      animation: move calc(var(--speed) * var(--num)) steps(var(--num)) infinite;
      animation-delay: var(--speed);
    }

    &-item {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: $size;
      animation: liMove var(--speed) infinite;
      animation-delay: var(--speed);
    }

    &-content {
      &:hover {
        animation-play-state: paused;
      }
    }

    &-content:hover &-item {
      animation-play-state: paused;
    }

    @keyframes move {
      0% {
        transform: translate(0, 0);
      }

      100% {
        transform: translate(0, calc(-1 * $size * var(--num)));
      }
    }

    @keyframes liMove {
      0% {
        transform: translate(0, 0);
      }

      80%,
      100% {
        transform: translate(0, -$size);
      }
    }
  }

  &-main {
    grid-area: 1/1/3/-1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: $gap;

    &.over {
      outline: 2px dashed $theme;
    }
  }

  &-banner {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    background-color: $theme;
    border-radius: 4px;

    &-content {
      grid-area: 1/1 / span 2/-1;
      display: grid;
      padding: 10px 10px 0;
      grid-template-columns: repeat(5, 1fr);
      gap: $gap;
    }

    &-status {
      display: grid;
      padding: 2px 10px;
      font-size: 12px;
    }
  }

  &-user {
    background-color: $theme;
    border-radius: 4px;
    overflow: hidden;
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  &-highlight {
    color: #000;
  }

  &-back {
    position: fixed;
    right: $padding;
    bottom: $padding;
    width: $size;
    height: $size;
    border-radius: 6px;
    background-color: $theme;
    cursor: pointer;
    transform: translateY(150%);
    animation: backToTop 1s linear forwards;
    animation-timeline: scroll();
    animation-range: entry 0 100px;
  }
}

@keyframes grow-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
@keyframes backToTop {
  from {
    transform: translateX(150%);
  }
  to {
    transform: translateY(0);
  }
}
::highlight(color1) {
  color: $theme;
}
</style>
