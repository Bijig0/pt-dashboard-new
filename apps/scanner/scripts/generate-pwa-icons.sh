#!/bin/bash
# Generate PWA icons from the source icon
# Usage: ./scripts/generate-pwa-icons.sh

set -e

SOURCE_ICON="assets/images/icon.png"
OUTPUT_DIR="public/pwa"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Generating PWA icons from $SOURCE_ICON..."

# Standard PWA icons
SIZES=(72 96 128 144 152 192 384 512)
for size in "${SIZES[@]}"; do
    echo "  Creating icon-${size}x${size}.png"
    sips -z $size $size "$SOURCE_ICON" --out "$OUTPUT_DIR/icon-${size}x${size}.png" > /dev/null 2>&1
done

# Maskable icon (same as 512x512 for now)
echo "  Creating maskable-icon-512x512.png"
cp "$OUTPUT_DIR/icon-512x512.png" "$OUTPUT_DIR/maskable-icon-512x512.png"

# Favicons
echo "  Creating favicon-16x16.png"
sips -z 16 16 "$SOURCE_ICON" --out "$OUTPUT_DIR/favicon-16x16.png" > /dev/null 2>&1
echo "  Creating favicon-32x32.png"
sips -z 32 32 "$SOURCE_ICON" --out "$OUTPUT_DIR/favicon-32x32.png" > /dev/null 2>&1

# Apple touch icons
echo "  Creating apple-touch-icon.png (180x180)"
sips -z 180 180 "$SOURCE_ICON" --out "$OUTPUT_DIR/apple-touch-icon.png" > /dev/null 2>&1
echo "  Creating apple-touch-icon-152x152.png"
sips -z 152 152 "$SOURCE_ICON" --out "$OUTPUT_DIR/apple-touch-icon-152x152.png" > /dev/null 2>&1
echo "  Creating apple-touch-icon-167x167.png"
sips -z 167 167 "$SOURCE_ICON" --out "$OUTPUT_DIR/apple-touch-icon-167x167.png" > /dev/null 2>&1
echo "  Creating apple-touch-icon-180x180.png"
sips -z 180 180 "$SOURCE_ICON" --out "$OUTPUT_DIR/apple-touch-icon-180x180.png" > /dev/null 2>&1

# Apple splash screens (using splash icon as source if available, otherwise main icon)
SPLASH_SOURCE="assets/images/splash-icon.png"
if [ ! -f "$SPLASH_SOURCE" ]; then
    SPLASH_SOURCE="$SOURCE_ICON"
fi

echo "Generating Apple splash screens from $SPLASH_SOURCE..."
# Note: These are simplified - proper splash screens should have specific aspect ratios
# For production, consider using a dedicated tool like pwa-asset-generator

# iPhone splash screens (portrait)
echo "  Creating apple-splash-640-1136.png (iPhone 5)"
sips -z 1136 640 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-640-1136.png" > /dev/null 2>&1 || \
sips -Z 640 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-640-1136.png" > /dev/null 2>&1

echo "  Creating apple-splash-750-1334.png (iPhone 6/7/8)"
sips -Z 750 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-750-1334.png" > /dev/null 2>&1

echo "  Creating apple-splash-1125-2436.png (iPhone X)"
sips -Z 1125 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-1125-2436.png" > /dev/null 2>&1

echo "  Creating apple-splash-1242-2208.png (iPhone 6+/7+/8+)"
sips -Z 1242 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-1242-2208.png" > /dev/null 2>&1

echo "  Creating apple-splash-1242-2688.png (iPhone XS Max)"
sips -Z 1242 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-1242-2688.png" > /dev/null 2>&1

# iPad splash screens (portrait)
echo "  Creating apple-splash-1536-2048.png (iPad)"
sips -Z 1536 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-1536-2048.png" > /dev/null 2>&1

echo "  Creating apple-splash-1668-2388.png (iPad Pro 11)"
sips -Z 1668 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-1668-2388.png" > /dev/null 2>&1

echo "  Creating apple-splash-2048-2732.png (iPad Pro 12.9)"
sips -Z 2048 "$SPLASH_SOURCE" --out "$OUTPUT_DIR/apple-splash-2048-2732.png" > /dev/null 2>&1

echo ""
echo "PWA icons generated successfully in $OUTPUT_DIR/"
echo ""
echo "Note: For production, consider using pwa-asset-generator for better splash screens:"
echo "  npx pwa-asset-generator assets/images/icon.png public/pwa -i app/+html.tsx -m public/manifest.json"
