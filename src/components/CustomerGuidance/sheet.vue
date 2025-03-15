<!-- components/CustomerGuidance/sheet.vue -->
<template>
  <div class="sheet-guidance">
    <h2>钣金加工必看</h2>
    <p>尊敬的客户：</p>
    <div class="indented-content">
      <p>您好！为了避免不必要的纠纷，我们建议您在下单前，仔细阅读以下加工须知：</p>
      <br>
    </div>
    <p>1、钣金加工系统支持以下格式图纸的识别及报价：</p>
    <div class="indented-content">
      <p>3D<strong>（必须）</strong> ：STEP（.step、.stp）</p>
      <p>2D ：pdf、dwg、dxf、jpg、png</p>
      <p>支持压缩包（.rar、.zip）直接上传，压缩包内应保证有3D文件（.step、.stp）</p>
      <p>2D ：pdf、dwg、dxf、jpg、png</p>
      <p>丝印/激光打标图纸建议在 “<strong>表面处理</strong>” 处上传；螺纹/压铆图纸建议在 “<strong>是否有螺纹或压铆文件</strong>” 处上传</p>
      </div>
    <p>2、为了更好得满足您的加工需求，我们建议您将产品的3D文件（必须）、2D文件、BOM清单、丝印文件等一并压缩上传（同款图纸的文件名称需要一致）</p>
    <p>3、单次上传图纸的数量≤20个，单个文件的大小＜100M</p>
    <p>4、因钣金装配体的特殊性，若零件之间有装配关系，我们强烈建议您以装配体上传；若以多个单零件上传，也请您备注哪些零件具有装配关系，以避免出现加工后零件无法进行组装的情况
    </p>
    <p>5、我们提供了标准化的材料、表面处理及加工工艺供您选择；具体详见： 钣金加工所支持的材料及工艺</p>
    <p>6、我们支持钣金装配体中单零件定制参数，若您对装配体的某个子零件有定制化需求，您可以在选择加工参数处填写，定制零件名称应与设计文件中的子零件名对应
    </p>
    <p>7、如果您在使用嘉立创CNC服务&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;的过程中，有任何的意见或者建议，可联系我们的业务联系人：罗小姐 18576608583</p>

  </div>
</template>

<script setup>
</script>

<style scoped>
.sheet-guidance {
  padding: 20px;
}

.indented-content {
  padding-left: 4ch; /* 这里使用 4ch 实现缩进 4 个字符宽度，近似于 4 个空格的效果 */
}
.sheet-thread-note {
  color: blue;
  text-decoration: none;
  cursor: pointer;
}
.sheet-thread-note:hover {
  text-decoration: underline;
}
</style>

<script setup>
</script>