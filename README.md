## Node.js installation 
To run gulp, you need to install Node.js, available here: https://nodejs.org/en/download/
Run the following command to check if Node.js is correctly installed:
```
npm -v
```

## Install dependencies

Before running your gulp project you need to install the dependencies.
Run the following command in your terminal, at the root the project:
```
npm install
```

### Run gulp
For the first time, use the following command to build the 'dist' folder:
```
gulp build
```
Use this command everytime you want to clean & rebuild the dist folder.

You can now run the project.
Run the following command:
```
gulp watch
```
You can work now. Happy development 🤘

-----

If you got a "EACCES" error during the installation, give yourself the correct admin right:
```
sudo chown -R $USER "PATH_TO_THE_PROJECT"
```