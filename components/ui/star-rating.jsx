import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StarRating Component
 * @param {number} rating - Current rating (0-5)
 * @param {boolean} readOnly - If true, non-interactive
 * @param {function} onChange - Callback(newRating) for interactive mode
 * @param {string} size - Size class for the stars (default "h-4 w-4")
 * @param {boolean} showValue - Show the numeric value next to stars
 */
export function StarRating({ 
    rating = 0, 
    readOnly = true, 
    onChange, 
    size = "h-4 w-4",
    showValue = false
}) {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange?.(star)}
                    className={cn(
                        "transition-all",
                        readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star 
                        className={cn(
                            size, 
                            star <= rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "fill-transparent text-gray-600"
                        )} 
                    />
                </button>
            ))}
            {showValue && (
                <span className="ml-2 text-sm font-medium text-gray-300">
                    {Number(rating).toFixed(1)}
                </span>
            )}
        </div>
    );
}
