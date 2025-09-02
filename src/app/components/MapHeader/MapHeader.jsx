"use-client"

//  Components
import BrandingControl from "../BrandingControl/BrandingControl";
import SearchBox from "../SearchBox/SearchBox";
import BlackSaddleButtonDesktop from "../BlackSaddleButtonDesktop/BlackSaddleButtonDesktop";

const MapHeader = () => {
  return (
    <div className="absolute top-0 left-0 w-full px-4 h-20 lg:h-30 z-20">
      <div className="relative w-full h-full">
        <div className="hidden lg:flex absolute top-0 left-0 w-1/4 h-full bg-[#00FF00]/0 items-center">
          <BrandingControl />
        </div>
        <div className="absolute top-0 lg:left-1/4 w-full lg:w-1/2 h-full bg-[#FF00FF]/0 flex items-center justify-center">
          <SearchBox />
        </div>
        <div className="hidden lg:flex absolute top-0 right-0 w-1/4 h-full bg-[#FF0000]/0 items-center justify-end">
          <BlackSaddleButtonDesktop />
        </div>
      </div>
    </div>
  );
}

export default MapHeader;