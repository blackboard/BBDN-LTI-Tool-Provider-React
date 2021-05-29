import logo from './pages/home/logo.svg';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import DeepLinkContent from "./pages/lti/deepLinkContent";
import Home from "./pages/home/home";

/**
 * Index Component for the application
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    return (
        <div className="App">
            <Routing/>
        </div>
    );
}

/**
 * Routing handler
 * @returns {JSX.Element}
 * @constructor
 */
const Routing = () => {
    return (
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={Home}/>
            <Route exact path='/deepLinkContent/:token'>
                <DeepLinkContent />
            </Route>
        </Switch>
    );
}

export default App;
