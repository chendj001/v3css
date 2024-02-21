<template>
  <div class="grid">
    <div class="grid-layout">
      <div class="grid-card">
        <div class="grid-cell">1</div>
      </div>
      <GridCard>
        <GridCell>
          <img class="grid-img" src="https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_a86e56c980b7955312b5702a547a4cf0~c5_300x300.jpeg?from=2956013662" alt="">
        </GridCell>
      </GridCard>
    </div>
  </div>
</template>

<script setup lang="ts" name="App">
import { defineComponent, h } from 'vue';


const GridCard = defineComponent({
  name: "GridCard",
  setup(props, { slots }) {
    return () => h('div', { class: 'grid-card' }, slots.default && slots.default())
  }
})
const GridCell = defineComponent({
  name: "GridCell",
  setup(props, { slots }) {
    return () => h('div', { class: 'grid-cell' }, slots.default && slots.default())
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

.grid {
  container-type: inline-size;
  padding-top: 20px;

  &-layout {
    display: grid;
    grid-template-columns: repeat(4, $width);
    justify-content: center;
    color: #fff;
    gap: $gap*2;
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
  }
  &-img {
    display: block;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
