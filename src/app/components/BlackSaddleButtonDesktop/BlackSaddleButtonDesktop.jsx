
// Context
import { useFilterData } from '../../context/FilterDataContext';
import { useMapData } from '../../context/MapDataContext';

const BlackSaddleButtonDesktop = () => {

  const { tripPriceInterval, nightPriceInterval } = useMapData();
  const { setSelectedMonths, setSelectedCategories, setSelectedCurrency, setSelectedPriceType, 
    setSelectedRidingLevel, setSelectedPriceInterval, selectedPriceType } = useFilterData();

  //  Handlers

  const buttonClickedHandler = () => {
    // Reset all the filters and show only Black Saddle rides
    setSelectedRidingLevel(null);
    setSelectedPriceInterval(selectedPriceType === "TRIP" ? tripPriceInterval : nightPriceInterval);
    setSelectedCategories(["BLACK SADDLE"]);
    setSelectedMonths([]);
  }

  return (
    <div className="hidden sm:flex justify-end right-8 z-20 pr-3">
      <a
        href="https://black-saddle.com/"
        target="_blank"
        title="Head to the Black Saddle webpage"
        className="flex items-center justify-center uppercase tracking-wider text-xs font-semibold text-[#FFF] border 
        border-[#FFF] border-2 rounded-full p-3 z-20 cursor-pointer">
        Black Saddle
      </a>
    </div>
  );
}

export default BlackSaddleButtonDesktop;