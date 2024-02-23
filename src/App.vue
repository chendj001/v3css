<template>
  <div class="grid">
    <div class="grid-layout ">
      <div class="grid-card " style=" view-transition-name: main-nav1;
  contain: layout;">
        <div class="grid-cell">1</div>
      </div>
      <GridCard>
        <GridMain style="grid-area: 1/1/3/-1; view-transition-name: popup-transition;"></GridMain>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
        <GridCell :icon="img"></GridCell>
      </GridCard>
    </div>
    <div class="box" style="position: absolute;right:0;bottom: 0;width:100px;height: 100px;background-color: #f00;"></div>
  </div>
</template>

<script setup lang="ts" name="App">
const img =
  'https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_a86e56c980b7955312b5702a547a4cf0~c5_300x300.jpeg?from=2956013662'
const img2 = 'https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_387022c140094613fbd5b711b59b94ca~c5_300x300.jpeg?from=2956013662'
import { defineComponent, h, ref, toRaw, computed } from 'vue'

const users = [{
  id: '001',
}, {
  id: '002',
}, {
  id: '100001',
  parent: '001',
  icon: img2,
}, {
  id: '100002',
  parent: '001',
  icon: img2
}, {
  id: '100003',
  parent: '001',
  icon: img2
}]

const GridCard = defineComponent({
  name: 'GridCard',
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'grid-card' }, slots.default && slots.default())
  }
})
const GridCell = defineComponent({
  name: 'GridCell',
  props: {
    icon: {
      type: String,
      default: () => ''
    },
    draggable: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props, { slots }) {
    const dragstart = (event: DragEvent) => {
      event.dataTransfer?.setData('text/plan', '001')
    }
    return () =>
      h(
        'div',
        {
          draggable: props.draggable,
          onDragstart: dragstart,
          class: 'grid-cell',
          style: {
            backgroundImage: props.icon && `url(${props.icon})`
          }
        },
        slots.default && slots.default()
      )
  }
})

const GridBanner = defineComponent({
  name: 'GridBanner',
  props: {
    app: {
      type: Object,
      default: () => null
    }
  },
  setup(props, { slots }) {
    const app = [
      {
        icon: img
      },
      {
        icon: img
      },
      {
        icon: img
      },
      {
        icon: img
      }
    ]
    const apps = computed(() => props.app.value || app)

    return {
      apps
    }

  },
  render() {
    console.log(this.apps)
    return h(
      'div',
      {
        class: 'grid-banner grid-cell'
      },
      [
        h(
          'div',
          {
            class: 'grid-banner-content'
          },
          this.apps.map((_app) => h(GridCell, { icon: _app.icon, draggable: false }))
        ),
        h(
          'div',
          {
            class: 'grid-banner-status'
          },
          '虾仁不眨眼！ 游戏 视频 动漫'
        )
      ]
    )
  }
})

const GridMain = defineComponent({
  name: 'GridMain',
  setup(props, { slots }) {
    const dragover = (event: DragEvent) => {
      event.preventDefault()
    }
    const elRef = ref(null)
    const child: any = ref(null);
    const theme = ref(false);
    const drop = (event: DragEvent) => {
      event.preventDefault()
      const data = event.dataTransfer?.getData('text/plan')
      const x = event.clientX;
      const y = event.clientY;
      const maxX = Math.max(x, innerWidth - x)
      const maxY = Math.max(y, innerWidth - y)
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const transition = document.startViewTransition(() => {
        child.value = child.value ? null : users.filter(item => data == item.parent);
        theme.value=!theme.value
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0 at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ]
          },
          {
            duration: 1000,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })





      // //@ts-ignore
      // event.target.style.viewTransitionName = 'GridMain'
      // //@ts-ignore
      // const transition: any = document.startViewTransition(() => {
      //   child.value = users.filter(item => data == item.parent);
      //   theme.value = !theme.value
      //   //@ts-ignore
      //   event.target.style.viewTransitionName = ''
      // })
      // transition.ready.then(() => {
      //   const clipPath = [
      //     `circle(0px at ${x}px ${y}px)`,
      //     `circle(${endRadius}px at ${x}px ${y}px)`,
      //   ];
      //   document.documentElement.animate(
      //     {
      //       clipPath: clipPath,
      //     },
      //     {
      //       duration: 2000,
      //       easing: "ease-in",
      //     }
      //   );
      // });



    }



    return () =>
      h(
        'div',
        {
          class: ['grid-main', theme.value ? 'theme' : ''],
          onDragover: dragover,
          onDrop: drop,
          ref: elRef
        },
        [
          h(GridCell, {
            draggable: false,
            icon: img,
            style: {
              gridArea: '1/1/span 2/span 2'
            }
          }),
          h(GridBanner, {
            app: toRaw(child),
            style: {
              gridArea: '1/3/span 2/ -1'
            }
          })
        ]
      )
  }
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


@keyframes clip {
  from {
    clip-path: circle(0% at var(--x) var(--y));
  }

  to {
    clip-path: circle(100% at var(--x) var(--y));
  }
}




// ::view-transition-image-pair(popup-transition) {
//   isolation: auto;
// }

::view-transition-old(popup-transition) {
  // animation: none;
}
::view-transition-new(popup-transition) {
  animation-duration: .15s;
}

.box {
  view-transition-name: main-nav;
  contain: layout;
}


.dark {
  // color-scheme: dark;
  background-color: #121212;
}

.grid {
  container-type: inline-size;
  padding-top: 20px;

  &-layout {
    display: grid;
    grid-template-columns: repeat(4, $width);
    justify-content: center;
    color: #fff;
    gap: $gap * 2;
    @include ContainerGrid($width, 4, $gap, 10px);
  }

  &-card {
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

  &-cell {
    background: $theme;
    border-radius: 4px;
    overflow: hidden;
    background-size: 100% 100%;
    cursor: pointer;
  }

  &-main {
    display: grid;
    gap: $gap;
    grid-template-columns: repeat(7, 1fr);
    border-radius: 4px;
    overflow: hidden;
    background-size: 100% 100%;


  }

  &-main.theme &-cell {
    background-color: #ff5c00;
  }

  &-banner {
    display: grid;
    grid-template-rows: repeat(3, 1fr);

    &-content {
      grid-area: 1/1 / span 2/-1;
      display: grid;
      padding: 10px 10px 0;
      grid-template-columns: repeat(4, 1fr);
      gap: $gap;
    }

    &-status {
      display: grid;
      align-items: center;
      padding: 0 10px;
      font-size: 12px;
    }
  }

  &-img {
    display: block;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
