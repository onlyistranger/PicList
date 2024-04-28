### ✨ Features

- Manage
  - Now, after modifying the custom domain name, the current page will be automatically forced to refresh
  - Now, the cloud-side latest file list is obtained by default when entering the management page for the first time
- Now the built-in s3 image bed defaults to allowing self-signed certificates
- Now the timestamp in advanced renaming is accurate to milliseconds

### 🐛 Bug Fixes

- Manage
  - Fixed the problem that forcing https does not take effect on the local image bed
- Fixed the problem that Minio cannot delete images normally when the region is not filled in
- Fixed the problem that the built-in s3 image bed will add an additional bucket name when used with Minio