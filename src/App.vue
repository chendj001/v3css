<template>
  <div class="show" @click="show = true">🤖</div>
  <div class="grid">
    <div class="grid-layout">
      <GridGroup :data="users" v-for="(users, index) in groups" :key="index">
      </GridGroup>
    </div>
  </div>
  <Dialog v-if="show"></Dialog>
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
    const desc = computed(() =>
      [props.data.name, ...(props?.data?.status || [])].join("\t|\t")
    );

    const title = ref(desc.value);
    const cChildren = computed(() => props.data.children || []);
    const cStatus = computed(() => {
      return title.value;
    });
    const onMouseenter = (user: User) => {
      title.value = [user.name].join("\t|\t");
    };
    const onMouseleave = () => {
      title.value = desc.value;
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
    const cData = computed(() => oData.value);
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
    const cData = computed(() => props.data);
    return () =>
      h(
        "div",
        {
          class: "grid-group",
        },
        [
          h(GridMain, {
            data: cData.value[0],
          }),
          cData.value.map((user) =>
            h(GridUser, {
              data: user,
            })
          ),
        ]
      );
  },
});

const Dialog = defineComponent({
  name: "Dilaog",
  setup() {
    const optionsGroup = [];
    const optionsId = [];
    console.log(groups.value);
    for (let key in groups.value) {
      let item = groups.value[key];
      item.map((cell) => {
        optionsId.push({
          label: cell.id,
          value: cell.id,
        });
      });
      optionsGroup.push({
        label: key,
        value: key,
      });
    }
    optionsId.push({
      label: "新的父类",
      value: String(optionsId.length + 1).padStart(3, "0"),
    });

    optionsGroup.push({
      label: "新的分组",
      value: "group_1000" + (optionsGroup.length + 1),
    });
    const list = ref([
      {
        label: "分组",
        name: "group",
        type: "select",
        options: optionsGroup,
      },
      {
        label: "父类",
        name: "parent",
        type: "select",
        options: optionsId,
      },
      {
        label: "id",
        name: "id",
        type: "input",
      },
      {
        label: "名称",
        name: "name",
        type: "input",
      },
      {
        label: "图标",
        name: "icon",
        type: "input",
      },
      {
        label: "链接",
        name: "url",
        type: "input",
      },
      {
        label: "分类",
        name: "status",
        type: "input",
      },
    ]);
    const baseForm = list.value.reduce((prev, curr) => {
      prev[curr.name] = "";
      return prev;
    }, {} as Record<string, string>);
    const form = ref(baseForm);
    const click = () => {
      let postData = {
        ...unref(form),
        status: form.value.status.split(" "),
      };
      fetch("https://api.github.com/repos/chendj001/v3css/issues/1/comments", {
        method: "POST",
        headers: {
          Authorization: `token ${token.replace(/XXXX/gm, "")}`,
        },
        cache: "no-cache",
        body: JSON.stringify({
          body: JSON.stringify(unref(form)),
        }),
      }).finally(() => {
        show.value = false;
      });
    };
    onMounted(() => {
      console.log(groups.value);
    });
    return () =>
      h(
        "div",
        {
          class: "dialog",
        },
        [
          h("div", { class: "dialog-mask" }),
          h(
            "div",
            { class: "dialog-content" },
            h("div", { class: "dialog-form" }, [
              list.value.map((item) =>
                h("div", { class: "dialog-form-item" }, [
                  h("div", { class: "dialog-form-label" }, item.label),
                  item.type == "select" &&
                    h(
                      "select",
                      {
                        class: "dialog-form-com dialog-input",
                        placeholder: "请输入",
                        value: form.value[item.name],
                        onChange: (e: MouseEvent) =>
                          (form.value[item.name] = e?.target?.value),
                      },
                      item.options?.map((option) =>
                        h("option", { value: option.value }, option.label)
                      )
                    ),
                  item.type == "input" &&
                    h("input", {
                      class: "dialog-form-com dialog-input",
                      placeholder: "请输入",
                      value: form.value[item.name],
                      onInput: (e: MouseEvent) =>
                        (form.value[item.name] = e?.target?.value),
                    }),
                ])
              ),
              h("div", { class: "dialog-btn", onClick: click }, "确定"),
            ])
          ),
        ]
      );
  },
});
const show = ref(false);
const groups = ref<Record<string, User[]>>();
let token = "ghp_XXXXsp8WlTftjAdHIbXXXXhAXecvvMEbXXXXPS3c6k2cvSV7";
onMounted(() => {
  let lUsers: any = localStorage.getItem("users");
  if (lUsers) {
    lUsers = JSON.parse(lUsers);
    groups.value = useUserGroup(lUsers);
  }
  let lUpdateAt: any = localStorage.getItem("updated_at");
  if (lUpdateAt) {
    lUpdateAt = Number(lUpdateAt);
  }
  let sUpdateAt = 0;
  fetch("https://api.github.com/repos/chendj001/v3css/issues/1/comments", {
    headers: {
      Authorization: `token ${token.replace(/XXXX/gm, "")}`,
    },
    cache: "no-cache",
  })
    .then((res) => res.json())
    .then((res) => {
      let oList: any = [];
      let updateList: any = [];
      res.map((item: any) => {
        updateList.push(new Date(item.updated_at || item.created_at).getTime());
        try {
          oList.push(new Function(`return ${item.body}`)());
        } catch (error) {
          console.log("出错了", item);
        }
      });
      sUpdateAt = Math.max(...updateList);
      if (sUpdateAt > lUpdateAt) {
        groups.value = useUserGroup(oList);
        localStorage.setItem("users", JSON.stringify(oList));
        localStorage.setItem("updated_at", sUpdateAt + "");
        console.log("更新了");
      }
      // show.value = true;
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
.dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  &-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.2);
  }
  &-content {
    position: absolute;
    width: 600px;
    padding: 15px;
    background: #fff;
    border-radius: 4px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &-form {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
    &-item {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 10px;
    }
    &-label {
      grid-area: 1/1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    &-com {
      grid-area: 1/2/-1/-1;
    }
  }
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $theme;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }

  &-input {
    display: flex;
    align-items: center;
    height: 32px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid $theme;
    padding: 0 10px;
    outline: none;
  }
}
</style>
