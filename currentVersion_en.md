✨ Features

- Now the browser will display the API document when accessing port 36677 (support `/` and `/upload` paths)
- Now the `heartbeat` interface supports `GET` requests
- Added built-in web service support, a simple web server is opened by default on port 37777, similar to `EasyWebSvr`
- Now no longer watermark `svg` images
- Now in the advanced renaming, `{md5}` uses the file content instead of the file name string calculation
- Now the pop-up window of the setting interface supports dragging to adjust the position
- Now the image processing process will record error logs

🐛 Bug Fixes

- Fixed the bug that the image watermark function cannot take effect when the watermark text is not set
- Fixed the problem that the port detection function did not work properly when the server port was occupied
