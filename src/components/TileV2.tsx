import TileDesign from "./TileDesign";
import type { TileProps } from "../types/tile-meta";
import { TILE_HEIGHT, TILE_WIDTH } from "../utils/tilePlacement";

type TileV2Props = TileProps;

const COLOR_FACEPLATE = "#F4EAD4";
const COLOR_BACKING = "#0F5132"; // Deep jade green base layer

const TileV2 = ({
  name,
  onSelect,
  isSelected,
}: TileV2Props) => {
  const tileClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onSelect?.();
  };

  // Dense mitered shadow: fills the 6px gap between faceplate and backing
  const faceplateShadow = `
    1px 1px 0px ${COLOR_BACKING},
    2px 2px 0px ${COLOR_BACKING},
    3px 3px 0px ${COLOR_BACKING},
    4px 4px 0px ${COLOR_BACKING},
    5px 5px 0px ${COLOR_BACKING},
    6px 6px 0px ${COLOR_BACKING}
  `;

  return (
    <button
      type="button"
      onClick={tileClickHandler}
      aria-label={name}
      aria-pressed={isSelected}
      className="relative cursor-pointer transition-all duration-150 ease-out"
      style={{
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        padding: 0,
        border: "none",
        appearance: "none",
        borderRadius: 0,
        backgroundColor: COLOR_BACKING,
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      {/* Faceplate layer: positioned Northwest of backing */}
      <div
        style={{
          position: "absolute",
          top: -6,
          left: -6,
          width: TILE_WIDTH,
          height: TILE_HEIGHT,
          backgroundColor: COLOR_FACEPLATE,
          boxShadow: faceplateShadow,
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className={isSelected ? "ring-2 ring-amber-500 bg-amber-500/20" : ""}
      >
        <TileDesign
          name={name}
          isSelected={isSelected}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </button>
  );
};

export default TileV2;