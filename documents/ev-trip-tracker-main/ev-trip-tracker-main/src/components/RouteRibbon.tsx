import { ITINERARY } from "@/types";
import { countryByCode } from "@/lib/utils";

// Horizontal route ribbon: visited stops are highlighted in ink, others muted.
export function RouteRibbon({ visited }: { visited: Set<string> }) {
  return (
    <div>
      <div className="text-[13px] font-extrabold mb-3">Your route</div>
      <div className="no-scrollbar flex items-start overflow-x-auto pb-1">
        {ITINERARY.map((stop, i) => {
          const country = countryByCode(stop.countryCode);
          const isVisited = !!country && visited.has(country.name);
          return (
            <div key={`${stop.city}-${i}`} className="flex items-center">
              {i > 0 && (
                <div
                  className="h-0.5 w-4 mt-[17px]"
                  style={{ background: isVisited ? "#16314a" : "#dcd2c2" }}
                />
              )}
              <div className="flex flex-col items-center min-w-[52px]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[17px]"
                  style={{ background: isVisited ? "#16314a" : "#ede3d3" }}
                >
                  {country?.flag ?? "🏳️"}
                </div>
                <div
                  className="text-[10px] font-bold mt-1.5 whitespace-nowrap"
                  style={{ color: isVisited ? "#16314a" : "#a99e8c" }}
                >
                  {stop.city}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
