import React from 'react';
import {useNavigate} from 'react-router-dom';

interface AppProps {
}

function App({}: AppProps) {
    const navigate = useNavigate();
    return (
        <div className="App">
            <StartSection navigate={navigate}/>
        </div>
    );
}


function StartSection({navigate}: { navigate: (str: string) => void }) {

    function addClicked(e: any) {
        e.preventDefault()
        navigate("/add");
    }

    function listen(e: any) {
        e.preventDefault()
        navigate("/listen?filename=U7Of7d0sXvfnCb3KvgDG");
    }

    return (
        <div className="bg-indigo-50">
            <div
                className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                    <span className="block">Ready to dive in?</span>
                    <span className="block text-indigo-600">This is Soundchat</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <a
                            href="/add"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            onClick={addClicked}
                        >
                            Add tune
                        </a>
                    </div>
                </div>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <a
                            href="/add"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            onClick={listen}
                        >
                            Listen...
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default App;
