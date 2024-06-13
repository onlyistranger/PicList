### ✨ Features

- PicBed
  - Now when uploading duplicate images to `sm.ms` image bed, the later uploaded image also supports cloud deletion
- Management
  - Now s3 image bed supports creating new storage channels
  - Adjusted some layouts of the management page
  - The code highlighting style is adjusted to stackoverflow-light
- Interface
  - Now the tray menu will display the open/close clipboard monitoring according to the current status, instead of always displaying all menus
  - Now the tray menu will display the open/close mini window according to the current status
  - Now when the mouse hovers over the tray icon, the current image bed and configuration name will be displayed
  - Removed some unnecessary global notifications on the settings page
  - Optimized the layout of the settings page in English
- Performance
  - Now the software will automatically clear the clipboard image cache folder when starting
  - Optimized the performance of reading configuration
  - Optimized the loading speed of multiple pages
  - Upgrade dependencies such as vue to the latest version

### 🐛 Bug Fixes

- Fix the problem that the software crashes when sending a delete request from obsidan
- Fix the problem that the software crashes when uploading clipboard images using the `webp` plugin
- Fix the problem that an error occurs when uploading a URL after setting image processing operations
- Fix the problem that the window size value is not updated when the original PicGo window size is set and the setting interface is reopened
- Fix the problem that the main interface menu repeatedly triggers the lag caused by repeatedly triggering the acquisition of the image bed configuration when loading and clicking
- Fix the problem that some drop-down boxes are not updated when switching languages
- Fix some translation errors
- Management page
  - Fix the problem that the folder copy link of some image beds is incorrect
  - Fix the css error of the file browsing page
