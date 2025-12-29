/**
 * Confidence level thresholds
 */
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.9, // >= 90% is high confidence
  MEDIUM: 0.7, // >= 70% is medium confidence
  // Below 70% is low confidence
};

/**
 * Confidence level enum
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Get confidence level from a confidence score
 */
export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    return 'high';
  }
  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return 'medium';
  }
  return 'low';
}

/**
 * Tailwind background color classes for confidence levels
 */
export const CONFIDENCE_BG_COLORS: Record<ConfidenceLevel, string> = {
  high: 'bg-green-100',
  medium: 'bg-yellow-100',
  low: 'bg-red-100',
};

/**
 * Tailwind border color classes for confidence levels
 */
export const CONFIDENCE_BORDER_COLORS: Record<ConfidenceLevel, string> = {
  high: 'border-green-300',
  medium: 'border-yellow-300',
  low: 'border-red-300',
};

/**
 * Tailwind text color classes for confidence levels
 */
export const CONFIDENCE_TEXT_COLORS: Record<ConfidenceLevel, string> = {
  high: 'text-green-700',
  medium: 'text-yellow-700',
  low: 'text-red-700',
};

/**
 * Hex color values for confidence levels (for non-Tailwind usage)
 */
export const CONFIDENCE_HEX_COLORS: Record<ConfidenceLevel, string> = {
  high: '#22c55e', // green-500
  medium: '#eab308', // yellow-500
  low: '#ef4444', // red-500
};

/**
 * Get background color class for a confidence score
 */
export function getConfidenceBgColor(confidence: number): string {
  return CONFIDENCE_BG_COLORS[getConfidenceLevel(confidence)];
}

/**
 * Get border color class for a confidence score
 */
export function getConfidenceBorderColor(confidence: number): string {
  return CONFIDENCE_BORDER_COLORS[getConfidenceLevel(confidence)];
}

/**
 * Get text color class for a confidence score
 */
export function getConfidenceTextColor(confidence: number): string {
  return CONFIDENCE_TEXT_COLORS[getConfidenceLevel(confidence)];
}

/**
 * Format confidence as percentage string
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Get descriptive label for confidence level
 */
export function getConfidenceLabel(confidence: number): string {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high':
      return 'High confidence';
    case 'medium':
      return 'Medium confidence';
    case 'low':
      return 'Low confidence';
  }
}
