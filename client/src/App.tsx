import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RootMenu from './components/RootMenu';
import styled from 'styled-components';
import Loading from './components/Loading';
import { themeMinty } from './config/Themes';
import { ThemeProvider } from '@material-ui/styles';

const RootStage = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
`;

const AudioVisualizer = React.lazy(() => import('./apps/AudioVisualizer'));
const GraphBuilder = React.lazy(() => import('./apps/GraphBuilder'));

const App = () => {
  return (
    <div>
      <ThemeProvider theme={themeMinty}>
        <Router>
          <div>
            <RootStage>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path='/audiovisualizer'>
                  <Suspense fallback={<Loading />}>
                    <AudioVisualizer />
                  </Suspense>
                </Route>
                <Route path='/graphbuilder'>
                  <Suspense fallback={<Loading />}>
                    <GraphBuilder />
                  </Suspense>
                </Route>
                <Route path='*'>
                  <div>404 not found</div>
                </Route>
              </Switch>
            </RootStage>
          </div>

          <nav>
            <RootMenu />
          </nav>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
