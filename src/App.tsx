import TeamFlow from './pages/teamFlow/TeamFlow';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <TeamFlow />
    </ReactFlowProvider>
  );
}

export default App;
