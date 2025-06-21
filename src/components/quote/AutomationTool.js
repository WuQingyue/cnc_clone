
import { ref, reactive, computed } from 'vue'

// 参数信息列表
export const parametersList = reactive([
  {
    id: 1,
    name: '铝合金',
      children: [
        {
          materialCategory: "铝合金",
          materialAccessId: "0d8a7a799a574b02822e67c48b57bee0",
          materialName: "铝合金-6061",
          materialCode: "A7",
          defaultMaterialFlag: true,
          materialRemark: "<p style=\"line-height: 25px;\"><span style=\"color: rgb(68, 68, 68); font-size: 14px; background-color: rgb(245, 245, 245);\">备注：铝合金不喷砂有刀痕，同时选择阳极氧化处理能得到光饰效果，且耐磨，还可以选择需要的颜色，建议根据实际情况选择喷砂、氧化处理。</span></p><p style=\"line-height: 25px;\"><span style=\"color: rgb(46, 149, 254); font-size: 14px; background-color: rgb(245, 245, 245);\">﻿</span><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499687938569728000?preview=false\" width=\"218\"> <img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499687938642112512?preview=false\" width=\"218\"> <img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499687939023523840?preview=false\" width=\"218\"></p>",
          useful: true
        },
        {
          materialAccessId: "adb54094f48645a0a85432adb3164bbd",
          materialName: "铝合金-7075",
          materialCode: "A8",
          defaultMaterialFlag: false,
          materialRemark:  "<p style=\"line-height: 25px;\"><span style=\"color: rgb(68, 68, 68); font-size: 14px; background-color: rgb(245, 245, 245);\">备注：1.铝合金不喷砂有刀痕，同时选择阳极氧化处理能得到光饰效果，且耐磨，还可以选择需要的颜色，建议根据实际情况选择喷砂、氧化处理；</span></p><p style=\"line-height: 25px;\"><span style=\"font-size: 14px; background-color: rgb(245, 245, 245); color: rgb(68, 68, 68);\">2.铝合金-7075厚度超过50mm时，表面氧化除了黑色，其他颜色会有材料纹。</span></p><p style=\"line-height: 25px;\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499690634156634112?preview=false\" width=\"218\"> <img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499690634311823360?preview=false\" width=\"218\"> <img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8499690634442792960?preview=false\" width=\"218\"></p>",
          useful: true
        }
      ]
  },
  {
    id: 2,
    name: '铜合金',
      children: [
        {
          materialCategory: "铜合金",
          materialAccessId: "71ff6fd7ce8448d5a3776fad45dd5b59",
          materialName: "黄铜-H59",
          materialCode: "U3",
          defaultMaterialFlag: false,
          materialRemark: "<p><span style=\"background-color: rgb(245, 245, 245); font-size: 14px; color: rgb(68, 68, 68);\">备注：铜件表面极易氧化，如未做钝化，收货后及时处理。</span></p>",
          useful: true
        },
        {
          materialCategory: "铜合金",
          materialAccessId: "10884b9bf07b47caa6c625a0fa87da1e",
          materialName: "紫铜-T2",
          materialCode: "U2",
          defaultMaterialFlag: false,
          materialRemark: "<p><span style=\"font-size: 14px; background-color: rgb(245, 245, 245); color: rgb(68, 68, 68);\">备注：铜件表面极易氧化，如未做钝化，收货后及时处理。</span></p>",
          useful: true
        }
      ]
  }, 
  {
    id: 3,
    name: '塑料',
      children: [
        {
            "materialAccessId": "ba7d04eb738b4b0a98a63a99b877ea14",
            "materialName": "工程塑料-ABS（白色）",
            "materialCode": "P111",
            "materialCategory": "塑料",
            "materialSort": 2,
            "defaultMaterialFlag": false,
            "materialRemark": "<p>备注：ABS不喷油表面容易有磨损划痕，喷油后表面更光滑、美观。</p>",
            "useful": true,
            "limitThicknessStart": 1.00,
            "limitThicknessEnd": 9999.00
        }
      ]
    }
  ])
// 当前选中的参数配置
export const currentParameters = ref(parametersList[0])

// 数量
export const quantity = ref(2)

// 加载状态
export const loading = ref(false)

// 错误信息
export const error = ref(null)


// 更新参数配置
export function updateParameters(parameterId) {
  const newParameters = parametersList.find(item => item.id === parameterId)
  if (newParameters) {
    currentParameters.value = newParameters
  }
}

// 更新数量
export function updateQuantity(newQuantity) {
  quantity.value = newQuantity
}

// 重置所有数据
export function resetData() {
  currentParameters.value = parametersList[0]
  quantity.value = 1
  error.value = null
}
export const surfaceTreatmentData = [
    {
        craftAccessId: "9890b57215cf45e7b37deeeda231f5f1",
        craftCode: "H21",
        craftName: "喷砂+普通阳极氧化",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：1.哑光，表面反光率低，光线模糊不明显，光感柔和，不刺眼；亮光，表面反光效果好，反光度高；</p><p style=\"line-height: 25px;\"><span style=\"color: rgb(255, 255, 255);\">备注：</span>2.喷砂默认统一按120目进行处理。</p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "0e29e74b4f8c42ca984a0f76eb8a2792",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "ac016ab6fcfc42aa8698db2722642738",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: true,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "86f6d6b328e0418b9cd3dc638519cff5",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: true,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                },
                {
                    craftAttributeAccessId: "e02eb2fc38ae4d1e978308959c4bfc8d",
                    parameterCode: "C2",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "04b227292ea540bd86c7d8cd7985e222",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "a01224f8ac914bb8a463785cf462f3d3",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                },
                {
                    craftAttributeAccessId: "401fbaae3fd04ca6b7380812dee17524",
                    parameterCode: "C4",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "c109b960493a401ab9f4db6b0c9bfcc1",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "6306488ed9ea4e6884c2447a61c1ae48",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深空灰"
                },
                {
                    craftAttributeAccessId: "b8b7236b2e794302815fe9f374039859",
                    parameterCode: "C5",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "2ee240cb948e473ebb2e813927a9f2e6",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "df68aa612343462ebe8c162907de2c5b",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#E10600",
                    value: "红色"
                },
                {
                    craftAttributeAccessId: "c3d175972fbe4693bc8b5708c5bd8a58",
                    parameterCode: "C6",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "5272fd17012d4ae5aec98dd94cf76cf0",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "c861e63edc3b4ecf8b7966fbc85c5270",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "粉红色"
                },
                {
                    craftAttributeAccessId: "91ea7339e4b147e4956feabefbb91df2",
                    parameterCode: "C7",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "66249f1f34f849ac926d6f0310fc32e9",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "6e3d93f39dc54300985f54679462c6dd",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#418FDE",
                    value: "天蓝色"
                },
                {
                    craftAttributeAccessId: "6f42b04b4300458d81aa64d641ddbbdc",
                    parameterCode: "C8",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "f844563e8b114a45b75db98ec7b04175",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "0d33d11881914f7fb9cad305eeec1a77",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深绿色"
                },
                {
                    craftAttributeAccessId: "a5e67a907f6c47769bb84d757794255d",
                    parameterCode: "C9",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "3e422a2cedee45798f32201ad9315b72",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "d83287309d2140e2b1fcfbf6e7aebfa2",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "沙金"
                }
            ]
        }
    },
    {
        craftAccessId: "74fda0c520b2472195b590a6232d1396",
        craftCode: "H23",
        craftName: "喷砂+导电氧化",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：喷砂默认统一按120目进行处理。</p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "5ab30ac549f948bd82b3913bc8fa87e4",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "本色"
                }
            ]
        }
    },
    {
        craftAccessId: "8bad1543502e4fd9a7986f1de5551d6b",
        craftCode: "H22",
        craftName: "喷砂+硬质阳极氧化",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：喷砂默认统一按120目进行处理。</p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "1e6f6ab6dda64927b182103b3675e38d",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                },
                {
                    craftAttributeAccessId: "2a57938df28a44c1b1eca22dcea04540",
                    parameterCode: "C2",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: false,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                }
            ]
        }
    },
    {
        craftAccessId: "e06e82a809064b43b8c01a0c000e8a88",
        craftCode: "JGDB1",
        craftName: "激光打标",
        craftCategory: "类别三",
        craftRemark: "<p style=\"line-height: 25px;\">备注：1.激光打标需上传2D图纸，格式支持DWG/DXF；</p><p style=\"line-height: 25px;\"><span style=\"color: rgb(255, 255, 255);\">备注：</span>2.打标后会露出材料本色，成本低且牢固不易掉，但不支持选颜色。</p><p style=\"line-height: 25px;\"><img src=\"https://www.sanweihou.com/3dpportal/fileInfo/previewDownloadFile?fileAccessId=aliCncMaterialImg_de2d200e8f304f278648a1ace4cd653b\" width=\"392\"></p>",
        option: {
            optionName: "图纸",
            visibleFlag: false,
            showType: 0,
            attrs: [
                {
                    craftAttributeAccessId: "14c6d2acf12f4aee91514a3ff0601a0d",
                    parameterCode: "U1",
                    enterType: 1,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "请上传图纸"
                }
            ]
        }
    },
    {
        craftAccessId: "0a5f5fa0aad34973bf6a15b95d2aaf7c",
        craftCode: "X3",
        craftName: "拉丝",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：只支持板类平面件（限1000*360mm），异型件圆弧面或台阶面无法进行拉丝处理。</p>",
        option: null
    },
    {
        craftAccessId: "a8945693f44445368266046b6934c660",
        craftCode: "SY1",
        craftName: "丝印",
        craftCategory: "类别三",
        craftRemark: "<p style=\"line-height: 25px;\"><span style=\"font-size: 14px; color: rgb(35, 35, 35);\">备注：1.丝印需上传2D图纸，格式支持DWG/DXF，金属材料建议选用激光打标；</span></p><p style=\"line-height: 25px;\"><span style=\"font-size: 14px; color: rgb(255, 255, 255);\">备注：</span><span style=\"font-size: 14px; color: rgb(35, 35, 35);\">2.请按1:1的比例设计或把尺寸在图中标注，并注明丝印颜色（不支持非平面印刷，支持单色、多彩色），示例如下：</span></p><p style=\"line-height: 25px;\"><img src=\"https://www.sanweihou.com/3dpportal/fileInfo/previewDownloadFile?fileAccessId=aliCncMaterialImg_94d6ca6e8daa4b65b43e5cf2870d0ee6\" width=\"394\"></p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "7d73e3f7e871491cadca118008fccc18",
                    parameterCode: "HS001",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "43f7d4bd34a84432a2045603f1fcedd9",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: true,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: true,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                },
                {
                    craftAttributeAccessId: "0b47fa84a5b4458cbc458a7b964f0400",
                    parameterCode: "BS001",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "2739a27d73604c2fb02760a344413808",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#FFFFFF",
                    value: "白色"
                },
                {
                    craftAttributeAccessId: "62a0d64827b94404bec467bd0fb9a86a",
                    parameterCode: "2347C",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "c2786954bd094c5e982ceb22bed799aa",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#E10600",
                    value: "红色"
                },
                {
                    craftAttributeAccessId: "101e59759a754259aecec8fe4a9cbf17",
                    parameterCode: "C19",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "66c474ae50024f8792e4a5a2d2d8f361",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#FF8F1C",
                    value: "橙色"
                },
                {
                    craftAttributeAccessId: "ff98cbbaa1ca4582afd3ae661a175d25",
                    parameterCode: "3945C",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "5e778c94b94c488380a4ef029660514d",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#F3E600",
                    value: "黄色"
                },
                {
                    craftAttributeAccessId: "21a6396f95c842bcb0b8fa62be28ea97",
                    parameterCode: "802C",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "d05aa220ed56405c95c2a6ce73538ac4",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#44D62C",
                    value: "绿色"
                },
                {
                    craftAttributeAccessId: "97ac279a69214a4bb0ac68000bf569e9",
                    parameterCode: "C20",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "b7e0c4f0d8374353b247cc7a7cf92a00",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#213B8B",
                    value: "青色"
                },
                {
                    craftAttributeAccessId: "47d5a4ced095426f83d99ec53f12a45c",
                    parameterCode: "513C",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "图纸",
                        visibleFlag: false,
                        showType: 0,
                        attrs: [
                            {
                                craftAttributeAccessId: "6dc7b9cbd0e34d99b5919d3be05af1e7",
                                parameterCode: "U1",
                                enterType: 1,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "请上传图纸"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#93328E",
                    value: "紫色"
                }
            ]
        }
    },
    {
        craftAccessId: "27c1749bbeea46ff9cfe320d059778b2",
        craftCode: "X7",
        craftName: "仅喷砂",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：铝合金不喷砂有刀痕，默认统一按120目进行喷砂。</p>",
        option: null
    },
    {
        craftAccessId: "a7cfb86bee8948bd916ff1be61db5bc0",
        craftCode: "H1",
        craftName: "普通阳极氧化(不喷砂)",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：1.不喷砂表面有刀痕，不美观，建议选择喷砂+普通阳极氧化；</p><p style=\"line-height: 20px;\"><span style=\"color: rgb(255, 255, 255);\">备注：</span>2.哑光，表面反光率低，光线模糊不明显，光感柔和，不刺眼；亮光，表面反光效果好，反光度高，光线清晰明亮。</p><p style=\"line-height: 20px;\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567388948587024384?preview=false\" width=\"290\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567388948683223040?preview=false\" width=\"290\"></p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "5aeb31a407ff48a181eaf7bb713f0e05",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "664bfcbbb2b64099850c6b8b3edfcb6b",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: true,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "22735042548444b2b03cb14a1ea68986",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                },
                {
                    craftAttributeAccessId: "1927f86e2f09419e8cee90cbeffde9ad",
                    parameterCode: "C2",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "fce0b8d439de4ffabdc619937421f495",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "1c15cb76b8c54e6c8353755d11228612",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                },
                {
                    craftAttributeAccessId: "ca81cfae3ce6455384a35f97a4eae25f",
                    parameterCode: "C4",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "034c67a4fa68477f8c76c22837a8f6da",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "ecd619f307a14dac865b1e53de92a7e4",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深空灰"
                },
                {
                    craftAttributeAccessId: "f0bd6492905f4bfe9a6c0803a90e2bd2",
                    parameterCode: "C5",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "ee1a05b006d84f6ab1080d2b7c110970",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "5251bb582d49483eb8762619acfc8957",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#E10600",
                    value: "红色"
                },
                {
                    craftAttributeAccessId: "f07bd17e21d341fbb0eb82d9c85095bb",
                    parameterCode: "C6",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "2e7c0067d38d45c2a1a5537c018d1a9a",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "db3c3f404481484f9b1ecf992e072308",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "粉红色"
                },
                {
                    craftAttributeAccessId: "b937dd2eb61d42279b6ef1a0aecf29b5",
                    parameterCode: "C7",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "339258bbd64b4bf7961225675ba7e3af",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "bcb510aae43e42a5b8b14b99fb827eeb",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#418FDE",
                    value: "天蓝色"
                },
                {
                    craftAttributeAccessId: "47f508c41e564261abf78228aeb29634",
                    parameterCode: "C8",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "438c23e13b134bb985e140c263561f3d",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "8f0399026ad54072a3649216e7f11ce8",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深绿色"
                },
                {
                    craftAttributeAccessId: "7cbac157b69d49ddbfd22b293a2f5199",
                    parameterCode: "C9",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "ccd017d4847d4915956723903f7dd52d",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "6e23ece46913455b9280fee856099fbd",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "沙金"
                }
            ]
        }
    },
    {
        craftAccessId: "20000fbb63cc476b80b58c0e0c208156",
        craftCode: "H15",
        craftName: "导电氧化(不喷砂)",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：1.不喷砂表面有刀痕，不美观，建议选择喷砂+导电氧化。</p><p style=\"line-height: 25px;\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567390137290391552?preview=false\" width=\"290\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567390280051646464?preview=false\" width=\"290\"></p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "296b70389021402aa984657bc2ab66c1",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                }
            ]
        }
    },
    {
        craftAccessId: "d06d2109ca1b4defb8fe818e31cc6d57",
        craftCode: "H3",
        craftName: "硬质阳极氧化(不喷砂)",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：不喷砂表面有刀痕，不美观，建议选择喷砂+硬质阳极氧化。</p><p style=\"line-height: 30px;\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567389773531123712?preview=false\" width=\"290\"><img src=\"https://fs-web-stream.jlc.com/fs-web-stream/file-operation/download/8567389938467934208?preview=false\" width=\"290\"></p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "f89a6125ae394565a37c2d6b6a37a084",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                },
                {
                    craftAttributeAccessId: "d02b0efa67fe404ea41cbb087aab4a39",
                    parameterCode: "C2",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: null,
                    defaultOptionFlag: false,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                }
            ]
        }
    },
    {
        craftAccessId: "9ed795628bee4e5f950113e93aeefce5",
        craftCode: "H24",
        craftName: "拉丝+普通阳极氧化",
        craftCategory: "类别二",
        craftRemark: "<p style=\"line-height: 25px;\">备注：1.哑光，表面反光率低，光线模糊不明显，光感柔和，不刺眼；亮光，表面反光效果好，反光度高；</p><p style=\"line-height: 25px;\"><span style=\"color: rgb(255, 255, 255);\">备注：</span>2.只支持板类平面件（限1000*360mm），异型件圆弧面或台阶面无法进行拉丝处理。</p>",
        option: {
            optionName: "颜色",
            visibleFlag: true,
            showType: 1,
            attrs: [
                {
                    craftAttributeAccessId: "5847809316eb4c65a066d8ba4bc8fd05",
                    parameterCode: "C1",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "04f5ca880e9a4e1186744b0391338baa",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: true,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "e8a64bc41d1f483bab135899d02f194b",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: true,
                    parameterInstruction: null,
                    value: "本色"
                },
                {
                    craftAttributeAccessId: "7e9020e9c14b4b88aebd23dc6461190f",
                    parameterCode: "C2",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "eebdb35bd3324e99ac2f0dfae6f56824",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "c4841f43224d4fdba0ad6e0285b007a9",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#2D2B28",
                    value: "黑色"
                },
                {
                    craftAttributeAccessId: "892f6e431d6e4bb4b412438a94a136f1",
                    parameterCode: "C4",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "9e8f6fe6adb144d79bf17c04ee320a05",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "17c8289276d945fda4a1bab6c69ba2ad",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深空灰"
                },
                {
                    craftAttributeAccessId: "59f671c3cf5e4b8e8614b41f9e1bebcd",
                    parameterCode: "C5",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "f74e1bb738824fdfb91e9c8fee8d109d",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "7a6f029165d84bb0b55d92fda58a9e68",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#E10600",
                    value: "红色"
                },
                {
                    craftAttributeAccessId: "bdb9a73da0084fb28b968ce77ffe4581",
                    parameterCode: "C6",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "5ec3ba1be0e3432ba815e43e74f8580a",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "07d49c2d603c4aeb9bae2861dfff05fe",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "粉红色"
                },
                {
                    craftAttributeAccessId: "d327a7fbd6294a288f488a051c6d9520",
                    parameterCode: "C7",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "9eed73e2f8564268916108af31a56591",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "f44479ae52b14ddcb862c82d3b1b51ac",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: "#418FDE",
                    value: "天蓝色"
                },
                {
                    craftAttributeAccessId: "eaffd84a859a44539521a6aaff664b4c",
                    parameterCode: "C8",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "27e7f069268345c189e0a2d31f6f6521",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "6dc836c4a16d40c08869765eeacb2573",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "深绿色"
                },
                {
                    craftAttributeAccessId: "39031d2278a0461b86e34c64070dc86d",
                    parameterCode: "C9",
                    enterType: 0,
                    descResource: "",
                    descResourcePath: null,
                    option: {
                        optionName: "光泽",
                        visibleFlag: false,
                        showType: 2,
                        attrs: [
                            {
                                craftAttributeAccessId: "d10596c71d9544fbbe9351be91de2ed5",
                                parameterCode: "G1",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "哑光"
                            },
                            {
                                craftAttributeAccessId: "998f3fe2f1c14cb2b98f8cef5f51f00d",
                                parameterCode: "G2",
                                enterType: 0,
                                descResource: "",
                                descResourcePath: null,
                                option: null,
                                defaultOptionFlag: false,
                                parameterInstruction: null,
                                value: "亮光"
                            }
                        ]
                    },
                    defaultOptionFlag: false,
                    parameterInstruction: null,
                    value: "沙金"
                }
            ]
        }
    }
];

export const roughness = {
    type: "Ra3.2",
    roughnessAccessId: "4e6158ff486640ab9c82196c64196fe9",
}
export const tolerance = {
    type: "GB/T 1804-2000 m级",
    toleranceAccessId: "4c5b4f8543b34dd2b4c861a270f36ea7",
}
