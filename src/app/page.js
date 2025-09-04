import { MapDataProvider } from './context/MapDataContext';
import { FilterDataProvider } from './context/FilterDataContext';
import Map from './components/Map/Map'

const Home = () => {
  return (
    <div className="w-screen h-[100dvh] overflow-y-hidden overflow-x-hidden">
      <MapDataProvider>
        <FilterDataProvider>
          <Map></Map>
        </FilterDataProvider>
      </MapDataProvider>
    </div>
  )
}

export default Home

