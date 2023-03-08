import Layout from './Layout'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Navigate } from 'react-router-dom';

function App(){
return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/notes" />} />
      <Route path="/notes" element={<Layout />}></Route>
      <Route path="/notes/:id/edit" element={<Layout />}></Route>
      <Route path="/notes/:id" element={<Layout />}></Route>
    </Routes>
  </BrowserRouter>
)
};
export default App;