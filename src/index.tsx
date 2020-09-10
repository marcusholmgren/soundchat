import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App';
import {AppShell} from './components'
import './css/index.css';
import {AddTune} from "./addtune";
import {Listen} from "./listen";
import {SelectArtist} from "./selectartist";
import {MySongs} from "./mysongs";
import {Signin} from "./signin";
import {NotFound} from "./notfound";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
        <AppShell>
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/artist" element={<SelectArtist />} />
                <Route path="/add" element={<AddTune />} />
                <Route path="/listen" element={<Listen />} />
                <Route path="/my-songs" element={<MySongs />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </AppShell>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
    import.meta.hot.accept();
}
