import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Explore } from "./pages/Explore";
import { CreateArt } from "./pages/CreateArt";
import { Accounts } from "./pages/Accounts";
import { AccountNotConnected } from "./pages/AccountNotConnected";
import { NFTViewFull } from "./pages/NFTViewFull";
import { ViewArt } from "./pages/ViewArt";
import InitializeArtPage from "./pages/InitializeArtPage";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          {/*} <Route path="*" element={<Navigate to="/explore" replace />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Home />} />
          {/*}  <Route path="/explore" element={<Explore />} /> */}
          <Route path="/draw" element={<InitializeArtPage />} />
          <Route path="/draw/:object_id" element={<CreateArt />} />
          <Route path="/art/:art_id" element={<ViewArt />} />
          <Route path="/account" element={<AccountNotConnected />} />
          <Route path="/account/:account_address" element={<Accounts />} />
          <Route path="/playart/:token_id" element={<NFTViewFull />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
