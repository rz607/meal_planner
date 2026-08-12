import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SearchPage from './SearchPage'
import FavouritesPage from './FavouritesPage'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Search</Link> | <Link to="/favourites">Favourites</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App