import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux"
import store from "./store/store.js"
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App /> 
  </Provider>,
)

//For pushing again twice