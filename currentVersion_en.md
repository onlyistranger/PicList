### ✨ Features

- Now when the `upload` interface only passes the `picbed` parameter, the default configuration of the corresponding image bed is used instead of the `Default` configuration
- Optimized the processing logic of the backup domain name of the smms image bed
- The built-in aws S3 image bed now uses a drop-down box when setting permissions, and `disableBucketPrefixToURL` is now modified to a boolean type
- Advanced renaming now supports the `{str-number}` format, where number is any number, and adds support for `{ms}` (milliseconds)
- In the management function, the upload custom renaming adds support for `{h}` (hour), `{i}` (minute), `{s}` (second), and `{timestamp}` is modified to milliseconds, and adds support for `{str-number}`
- In the management function, the Alibaba Cloud image bed adds support for creating `oss-cn-wuhan (South China 1-Wuhan)` regional storage buckets
- Optimized the layout of the placeholder description page for renaming
- The Docker version of PicList-core now changes the time zone to East Eight District

### 🐛 Bug Fixes

- Fixed the description of the timestamp in advanced renaming, changed from seconds to milliseconds
