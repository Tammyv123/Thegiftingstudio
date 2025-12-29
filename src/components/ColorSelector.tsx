import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string, index: number) => void;
  size?: "sm" | "md";
}

// Map common color names to CSS colors
const colorMap: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  black: "#000000",
  white: "#ffffff",
  gray: "#6b7280",
  grey: "#6b7280",
  brown: "#78350f",
  gold: "#d4a574",
  silver: "#c0c0c0",
  navy: "#1e3a5f",
  beige: "#f5f5dc",
  maroon: "#800000",
  cream: "#fffdd0",
  teal: "#14b8a6",
  coral: "#ff7f50",
  lavender: "#e6e6fa",
  mint: "#98fb98",
  peach: "#ffdab9",
  rose: "#ff007f",
  ivory: "#fffff0",
  champagne: "#f7e7ce",
  burgundy: "#722f37",
  olive: "#808000",
  turquoise: "#40e0d0",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  mustard: "#ffdb58",
  nude: "#e3bc9a",
  blush: "#de5d83",
  wine: "#722f37",
  emerald: "#50c878",
  sapphire: "#0f52ba",
  ruby: "#e0115f",
  amber: "#ffbf00",
};

const getColorStyle = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || normalized;
};

export const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
  size = "md",
}: ColorSelectorProps) => {
  if (!colors || colors.length === 0) return null;

  const sizeClasses = size === "sm" 
    ? "w-6 h-6" 
    : "w-8 h-8";

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => {
        const colorStyle = getColorStyle(color);
        const isSelected = selectedColor === color;
        const isLight = ["white", "ivory", "cream", "beige", "champagne", "nude", "yellow"].includes(color.toLowerCase().trim());

        return (
          <button
            key={`${color}-${index}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onColorSelect(color, index);
            }}
            className={cn(
              sizeClasses,
              "rounded-full border-2 transition-all duration-200 relative",
              isSelected 
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                : "hover:scale-105",
              isLight ? "border-border" : "border-transparent"
            )}
            style={{ backgroundColor: colorStyle }}
            title={color}
            aria-label={`Select ${color} color`}
          >
            {isSelected && (
              <span 
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-xs font-bold",
                  isLight ? "text-foreground" : "text-white"
                )}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
