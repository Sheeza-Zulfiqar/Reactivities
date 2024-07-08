import { useEffect } from 'react'
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            {/* when routes load then this gets swapped with the actual one  */}
            <Outlet />
          </Container>
        </>
      )}

    </>

  )
}

export default observer(App);
