<template>
  <div class="grid">
    <div class="grid-layout">
      <GridCard :data="users" v-for="(users, index) in groups" :key="index">
      </GridCard>
    </div>
  </div>
</template>

<script setup lang="ts" name="App">
import {
  defineComponent,
  h,
  ref,
  toRaw,
  computed,
  type PropType,
  unref,
  readonly,
} from "vue";

import { userGroup, useUserGroup } from "./users";
const groups = readonly(useUserGroup(userGroup));
console.log(groups);
type User = (typeof groups)[string][number];

const GridCard = defineComponent({
  name: "GridCard",
  props: {
    data: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { slots }) {
    return () =>
      h("div", { class: "grid-card" }, [
        h(GridMain, {
          data: props?.data[0],
        }),
        props.data?.map((item) =>
          h(GridCell, {
            data: item,
          })
        ),
      ]);
  },
});
const GridCell = defineComponent({
  name: "GridCell",
  props: {
    draggable: {
      type: Boolean,
      default: () => true,
    },
    data: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { slots }) {
    const dragstart = (event: DragEvent) => {
      event.dataTransfer?.setData("text/plan", JSON.stringify(props.data));
    };
    return () =>
      h(
        "div",
        {
          draggable: props.draggable,
          onDragstart: dragstart,
          class: "grid-cell",
          style: {
            backgroundImage: props?.data?.icon && `url(${props.data.icon})`,
          },
        },
        slots.default && slots.default()
      );
  },
});

const GridBanner = defineComponent({
  name: "GridBanner",
  props: {
    data: {
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    const apps = computed(() => props.data.value.children || []);
    const status = computed(() => {
      if (props.data.value) {
        return (
          props.data?.value?.name +
          " " +
          props.data.value.children.map((item) => item.name).join(" ")
        );
      }
      return props.data?.value?.name;
    });

    return {
      apps,
      status,
    };
  },
  render() {
    return h(
      "div",
      {
        class: "grid-banner grid-cell",
      },
      [
        h(
          "div",
          {
            class: "grid-banner-content",
          },
          this.apps?.map((_app) =>
            h(GridCell, { data: _app, draggable: false })
          )
        ),
        h(
          "div",
          {
            class: "grid-banner-status",
          },
          this.status
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
  setup(props, { slots }) {
    const dragover = (event: DragEvent) => {
      event.preventDefault();
    };
    const elRef = ref(null);

    const theme = ref(false);
    const status = ref("");
    const user = ref(props.data);
    const child: any = ref(props.data.children);
    const _user = computed(() => {
      return user.value;
    });
    const drop = (event: DragEvent) => {
      event.preventDefault();
      let data: any = event.dataTransfer?.getData("text/plan");
      if (data) {
        data = JSON.parse(data);
      }
      user.value = data;
      child.value = data.children;
      status.value = data.children.map((item: any) => item.name).join(" ");
    };

    return () =>
      h(
        "div",
        {
          class: ["grid-main", theme.value ? "theme" : ""],
          onDragover: dragover,
          onDrop: drop,
          ref: elRef,
          style: {
            gridArea: "1/1/3/-1",
          },
        },
        [
          h(GridCell, {
            draggable: false,
            data: _user.value,
            style: {
              gridArea: "1/1/span 2/span 2",
            },
          }),
          h(GridBanner, {
            data: _user,
            style: {
              gridArea: "1/3/span 2/ -1",
            },
          }),
        ]
      );
  },
});

const op = ref("223");
console.log(op.value);
const op2 = unref(op);
op.value = "000000";
console.log(op.value);
console.log(op2);
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
