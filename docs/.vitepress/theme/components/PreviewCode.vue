<!--
 * @Date: 2025-02-05 20:43:26
 * @LastEditors: dajingyu
 * @LastEditTime: 2025-02-05 20:43:31
 * @Description: 文件信息
-->
<template>
  <div class="demo-container">
    <div class="demo-preview">
      <slot
        name="preview"
      ></slot>
    </div>
    <div class="demo-code">
      <slot
        name="code"
      ></slot>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid #e2e2e3;
  border-radius: 8px;
  margin: 1rem 0;
}
.demo-preview {
  padding: 1rem;
  background: #f8f8f8;
}
.demo-code {
  border-top: 1px solid
    #e2e2e3;
  background: var(
    --vp-code-block-bg
  );
}
</style>
