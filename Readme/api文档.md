# 加工系统

## 在线估价

## 创建订单（审核）

## 查询订单（可以查询到状态）

## 查询订单生产进度接口(可以查询到加工完成的整个流程)

## 查询订单物流轨迹

## 查询订单实物图

## 查询订单明细价格

# 物流系统

## 创建订单

## 跟踪订单

## 取消订单

## 支付订单

# 下单系统

## 上传文件

### upload/uploadDrawFile

<p>
```
{
    "success": true,
    "code": 200,
    "message": null,
    "data": [
        {
            "fileInfoAccessId": "df45a2852aa84694be561329128ba76d",
            "productName": "2",
            "parentFileName": "2",
            "groupFileName": "2",
            "fileType": "3d_origin",
            "fileFormat": "step",
            "fileName": "2.step",
            "errorMsg": null,
            "errorCause": null,
            "uploadFlag": true
        }
    ]
}
```
<strong>
这里面有用的信息是：fileInfoAccessId
</strong>
</p>

### upload/upload

<p>
```
{
    "success": true,
    "file_id": 18,
    "forface_response": {
        "tokenKey": "65ff6df11a6990a2ceff6d9dac32b312"
    }
}
```
<strong>
获取tokenKey，可以获取预览图的url，
存储到数据库中
</p>

### upload/analyze_model

<p>
确定一下fileInfoAccessId，获取模型的尺寸信息
</p>

## 下单

### upload/get_analysis_result

获取模型尺寸信息

```
{
    "success": true,
    "code": 200,
    "message": null,
    "data": {
        "groupFileName": "2",
        "productName": "2",
        "productModelAccessId": "43909909e22f41c4ae4d09e4557f0155",
        "drawFileVOS": [
            {
                "productName": "2",
                "fileInfoAccessId": "df45a2852aa84694be561329128ba76d",
                "fileType": "3d_origin",
                "fileName": "2.step",
                "fileMd5": "QP/eG2TdRU9f3mVG1YVRJw==",
                "fileSystemUuid": "8610205571770732544",
                "fileFormat": "step",
                "errorMsg": null,
                "errorCause": null
            }
        ],
        "sizeX": 10.0,
        "sizeY": 10.0,
        "sizeZ": 10.0,
        "modelVolume": 1000.0,
        "modelSurfaceArea": 600.0,
        "modelAnalysisAccessId": "a6f887c99c2046329357971bca3bb0f1",
        "previewUrl": "https://www.jlc-cnc.com/cncCommon/#/forfacePreview3D?modelName=2.step&previewUrl=https://attachment.forface3d.com/forfaceModelResource/20250423143102jk2p/Metadata.f3d?fileAccessId=8603391808052240384&fType=f3d",
        "thumbnailUrl": "https://www.jlc-cnc.com/modelAnalyzer/file/visible/thumbnail?fileSystemUuid=8603391817724575744",
        "upload3DFlag": true,
        "upload2DFlag": false,
        "errorMsg": null,
        "analysisFlag": true,
        "assembleFlag": false,
        "completeFlag": true,
        "withLettering": false
    }
}
```

## 获取价格信息

### /price/price

```
[
    {
        "bizId": "e6cfcd0e7b5e49b793f6954f673bbf88",
        "deliveryHours": 120,
        "manualFlag": false,
        "price": 91.98,
        "quantity": 1,
        "clampPrice": 0.0,
        "craftPrice": 0.0,
        "expeditedPrice": 0.0,
        "materialPrice": 3.47,
        "processPrice": 50.85,
        "programPrice": 37.66,
        "remissionFlag": false,
        "remissionAmount": null,
        "manualQuoteReason": null,
        "classifyName": null,
        "featureCode": null,
        "showFeatureCode": null,
        "dfmDetectionName": null,
        "eligible": null,
        "eligibleReason": null
    }
]
```

### 获取 bizOrderAccessIds

/price/get_orderAccessIds

```
{
    "success": true,
    "code": 200,
    "message": null,
    "data": {
        "orderAccessIds": [
            "0dacae52b8f64246bcf0ff175e01fabb"
        ]
    }
}
```

### 获取运费

/price/place_calculate_coupon_fee

```

```

### 检查订单状态

https://member.jlc.com/api/cgi/cncOrder/order/checkOrderProducts
