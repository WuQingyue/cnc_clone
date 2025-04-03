
export const processList = [
  {
    type: 'mechanical',
    name: '机械/自动化零部件选购',
    description: '新人领30元优惠劵',
    route: '/mechanical-parts'
  },
  {
    type: '3dprint',
    name: '3D打印',
    description: '树脂/尼龙/金属3D打印服务',
    acceptTypes: '.stl,.stp,.step,.obj,.3mf,.zip,.rar',
    icon: 'fa-solid fa-print',
    uploadTips: [
      '拖拽文件到此处，或 点击上传',
      '支持3D格式:stl/stp/step/obj/3mf，单次上传文件数量≤20个，单个文件大小<100M，全彩打印可上传压缩文件rar/zip',
      '注:为了更准确打印以及避免不必要的纠纷，强烈建议上传STL格式文件!',
      '特别提醒:壁厚需大于1.2mm，处不低于0.8mm'
    ]
  },
  {
    type: 'cnc',
    name: 'CNC加工',
    description: '铝件/钢件/塑胶件，快速打样',
    acceptTypes: '.stp,.step,.dwg,.dxf,.pdf,.zip,.rar',
    icon: require('@/assets/images/safety.png'),
    uploadTips: [
      '支持3D<strong style="color: black;">(必须)</strong>格式:<strong style="color: black;">step,stp</strong>;支持2D格式:<strong style="color: black;">dwg,dxf,pdf</strong>，可压缩包(<strong style="color: black;">zip、rar</strong>)直接上传',
      '建议您同时上传3D(必须)和2D图纸，同一款零件3D和2D图纸名称需要一致',
      '单次上传文件 <strong style="color: blue;">≤20</strong> 个，单个文件大小<strong style="color: blue;"><100M</strong>',
      '<img src="IMAGE_PLACEHOLDER" style="width: 15px;"><strong style="color:rgb(59, 228, 186);">嘉立创CNC将对您的文件绝对保密，保护您的知识产权</strong>'  
    ]
  },
  {
    type: 'sheet',
    name: '钣金加工',
    description: '激光切割/折弯压铆/焊接喷涂',
    acceptTypes: '.dxf,.dwg,.stp,.step',
    uploadTips: [
      '支持格式：DXF、DWG、STP、STEP',
      '单个文件大小不超过50MB',
      '建议上传2D图纸或3D模型',
      '支持各类钣金工艺'
    ]
  },
  {
    type: 'mold',
    name: '手板复模',
    description: '手板件塑料外壳，小批量打样',
    acceptTypes: '.stp,.step,.igs,.iges,.x_t',
    icon: 'fa-solid fa-hand-holding-dollar',
    uploadTips: [
      '支持格式：STP、STEP、IGS、IGES、X_T',
      '单个文件大小不超过50MB',
      '建议上传3D模型文件',
      '支持手板、复模等工艺'
    ]
  },
  {
    type: 'aluminum',
    name: '铝合金壳体',
    description: '百种壳体，一个起订',
    route: '/aluminum-case'
  }
]