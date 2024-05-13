### ✨ Features

- 现在`upload`接口只传递`picbed`参数时，使用对应图床的默认配置，而不是`Default`配置
- 优化了对smms图床的备用域名的处理逻辑
- 内置aws S3图床现在设置权限时使用下拉选择框，同时`disableBucketPrefixToURL`现在修改为布尔类型
- 高级重命名现在支持`{str-number}`格式，其中number为任意数字，新增`{ms}`（毫秒)的支持
- 管理功能中，上传自定义重命名新增对`{h}`(小时)，`{i}`(分钟)，`{s}`（秒），，同时`{timestamp}`修改为毫秒，新增对`{str-number}`的支持
- 管理功能中，阿里云图床新增对创建`oss-cn-wuhan(华南1-武汉)`地域存储桶的支持
- 优化了重命名占位符说明页面的排版
- Docker版本PicList-core现在修改时区为东八区

### 🐛 Bug Fixes

- 修正了高级重命名中时间戳的说明，由秒修改为毫秒
