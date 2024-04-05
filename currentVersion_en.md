✨ Features

- Picture bed function optimization
  - Optimized the processing of the path set to `/` for github and other picture beds
  - Now it will automatically process the `/` at the beginning and end of the upload path, and most picture beds no longer require the path to end with `/`
  - Optimized the processing of custom websites, now it will automatically remove the extra `/` at the end
- Upload server
  - Now the upload requests from the local machine no longer require authentication
  - Now browsing port 36677 will display the API document (support `/` and `/upload` paths)
  - Now the `heartbeat` interface supports `GET` requests
- Added built-in web service support, a simple web server is opened by default on port 37777, similar to `EasyWebSvr`
- Now no longer watermark `svg` images
- Now the `{md5}` in the advanced rename uses the file content instead of the file name string for calculation
- The regular expression matching of the album URL modification function now adds the `u` modifier
- Now the pop-up window in the settings interface supports dragging to adjust the position
- Now the image processing process will record error logs

🐛 Bug Fixes

- Fix the problem of Typora upload failure after setting the server authentication key
- Fixed the bug that the image watermark function does not take effect when the watermark text is not set
- Fixed the problem that the port detection function does not work properly when the server port is occupied
