<template>
  <div class="grid">
    <div class="grid-layout">
      <GridGroup :data="users" v-for="(users, index) in groups" :key="index">
      </GridGroup>
    </div>
  </div>
</template>

<script setup lang="ts" name="App">
import {
  defineComponent,
  type PropType,
  h,
  computed,
  ref,
  unref,
  onMounted,
} from "vue";
import { useUserGroup, type User } from "@/utils";
/**
 * 用户组件
 */
const GridUser = defineComponent({
  name: "GridUser",
  props: {
    data: {
      type: Object as PropType<User>,
    },
    /**
     * 是否允许拖拽-默认false
     */
    draggable: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props, { slots }) {
    // 开始拖拽
    const dragstart = (event: DragEvent) => {
      event.dataTransfer?.setData("userData", JSON.stringify(props.data));
    };
    const svgToBase64 = (svg: string) => {
      if (svg.startsWith("<svg")) {
        return `url("data:image/svg+xml;base64,${btoa(
          decodeURIComponent(encodeURIComponent(svg))
        )}")`;
      } else {
        return `url(${svg})`;
      }
    };
    return () =>
      h(
        "a",
        {
          class: "grid-user",
          href: props.data?.url || "javascript:void(0)",
          target: props.data?.url && "_blank",
          draggable: props.draggable,
          style: {
            backgroundColor: props?.data?.icon && "transparent",
            backgroundImage: props?.data?.icon && svgToBase64(props.data.icon),
          },
          onDragstart: dragstart,
        },
        slots.default && slots.default()
      );
  },
});
const GridBanner = defineComponent({
  name: "GridBanner",
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => null,
    },
  },
  setup(props) {
    const desc = [props.data.name, ...(props?.data?.status || [])].join(
      "\t|\t"
    );
    const title = ref(desc);
    const cChildren = computed(() => props.data.children || []);
    const cStatus = computed(() => {
      return title.value;
    });
    const onMouseenter = (user: User) => {
      title.value = [user.name].join("\t|\t");
    };
    const onMouseleave = () => {
      title.value = desc;
    };
    return () =>
      h(
        "div",
        {
          class: "grid-banner",
        },
        [
          h(
            "div",
            {
              class: "grid-banner-content",
            },
            cChildren.value?.map((user) =>
              h(GridUser, {
                data: user,
                draggable: false,
                onMouseleave,
                onMouseenter: () => onMouseenter(user),
              })
            )
          ),
          h(
            "div",
            {
              class: "grid-banner-status",
            },
            cStatus.value
          ),
        ]
      );
  },
});

const GridMain = defineComponent({
  name: "GridMain",
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => null,
    },
  },
  setup(props) {
    const oData = ref(props.data);
    const cData = computed(() => oData);
    const dragover = (event: DragEvent) => {
      event.preventDefault();
    };

    const drop = (event: DragEvent) => {
      event.preventDefault();
      let strData: any = event.dataTransfer?.getData("userData");
      let sData = JSON.parse(strData) as User;
      if (sData.group == props.data.group) {
        oData.value = sData;
      }
    };
    return () =>
      h(
        "div",
        {
          class: ["grid-main"],
          onDragover: dragover,
          onDrop: drop,
        },
        [
          h(GridUser, {
            data: unref(cData.value),
            draggable: false,
            style: {
              gridArea: "1/1/span 2/span 2",
            },
          }),
          h(GridBanner, {
            data: unref(cData.value),
            style: {
              gridArea: "1/3/span 2/-1",
            },
          }),
        ]
      );
  },
});
const GridGroup = defineComponent({
  name: "GridGroup",
  props: {
    /**
     * 对象数组
     */
    data: {
      type: Array as PropType<User[]>,
      default: () => [],
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: "grid-group",
        },
        [
          h(GridMain, {
            data: props.data[0],
          }),
          props.data.map((user) =>
            h(GridUser, {
              data: user,
            })
          ),
        ]
      );
  },
});
const groups = ref<Record<string, User[]>>();
onMounted(() => {
  fetch("/public/userData.js")
    .then((res) => res.text())
    .then((res) => {
      let users = Function(`return ${res}`)();
      localStorage.setItem('users',JSON.stringify(users))
      groups.value = useUserGroup(users);
    });
});
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
    grid-template-columns: repeat(4, $width);
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
}
</style>
