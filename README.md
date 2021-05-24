# Briefly2.0

Prerequisite: 

If something went wrong, you can directly delete the `npm_modules` at the `frontend` folder and do following: 

1. start your virtual environment.  If you use `pipenv`, you can run `pipenv install`, which installs all modules listed in `Pipfile`

2. cd to `frontend` and run `npm install`, which will automatically install all packages listed in `packages.json`.


Or try following:

install pipenv on your os, or any other virtual environment of your preference
```
pip install pipenv
```
To Create a virtual environment and install modules within this virtue environment
```
pipenv install django djangorestframework
pipenv shell
```
cd to frontend directory and run following command one by one
make sure npm is installed on your os

```
npm init -y
npm i webpack webpack-cli --save-dev
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react react-dom --save-dev
npm install @material-ui/core
npm install @babel/plugin-proposal-class-properties
npm install react-router-dom
npm install @material-ui/icons
npm install @material-ui/styles
```
To run the code, open two shell prompts:
In the first one:
```
pipenv shell
python manage.py runserver
```
In the second one:
```
npm run dev
```
then you are all set!!

