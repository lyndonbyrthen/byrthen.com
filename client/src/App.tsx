import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import RootMenu from './components/RootMenu';
import styled from 'styled-components';
import { ThemeProvider, fade } from '@material-ui/core/styles';

import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  }
});

// const theme = createMuiTheme({
//   "palette": {
//     "primary1Color": Colors.teal300,
//     "primary2Color": Colors.teal300,
//     "accent2Color": Colors.indigo100,
//     "accent3Color": Colors.deepPurple300,
//     "textColor": Colors.blueGrey600,
//     "secondaryTextColor": Colors.grey500,
//     "canvasColor": fade(Colors.green50, 0.9),
//     "borderColor": fade(Colors.blue200, 0.5),
//     "accent1Color": Colors.indigo300,
//     "pickerHeaderColor": Colors.teal100,
//     "shadowColor": Colors.teal900
// }
// });
// const getTheme = () => {
//   let overwrites = {
//     "palette": {
//         "primary1Color": "#4db6ac",
//         "primary2Color": "#4db6ac",
//         "accent2Color": "#c5cae9",
//         "accent3Color": "#9575cd",
//         "textColor": "#546e7a",
//         "secondaryTextColor": "#9e9e9e",
//         "canvasColor": "rgba(232, 245, 233, 0.9)",
//         "borderColor": "rgba(144, 202, 249, 0.5)",
//         "accent1Color": "#7986cb",
//         "pickerHeaderColor": "#b2dfdb",
//         "shadowColor": "#004d40"
//     }
// };
//   return getMuiTheme(baseTheme, overwrites);
// }

const RootStage = styled.div`
  top:0;
  left:0;
  position: fixed;
  width: 100%;
  height: 100%;
`;

const AudioVisualizer = React.lazy(() => import('./apps/AudioVisualizer'));

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>

        <Router>
          <div>
            <RootStage>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/audiovisualizer">
                  <Suspense fallback={<div>loadin</div>}>
                    <AudioVisualizer />
                  </Suspense>
                </Route>
                <Route path="/app2">
                  <div>App 2</div>
                </Route>
                <Route path="/app3">
                  <div>App 3</div>
                </Route>
              </Switch>
            </RootStage>
          </div>

          <nav>
            <RootMenu />
          </nav>

        </Router>
      </ThemeProvider>

    </div >

  );
}

export default App;
