This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

To install all dependencies run `npm install`

Get server container
```bash
opensoundstream/oss-server:alpine
```

Run docker container with
```bash
docker run -p 8080:8000 -e DJANGO_HOST=*  opensoundstream/oss-server:alpine
```
On windows if using Docker Toolbox do the following:
- Open Virtual Box
- Select `default`
- Open Settings -> Network -> Adapter 1 -> Advanced -> Port Forwarding
- Create Entry with Host & Guest Port `8080`, leave IPs blank

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
