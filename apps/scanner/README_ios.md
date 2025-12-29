# Handwriting Scanner

A modern SwiftUI iOS application that uses advanced OCR technology to scan handwritten documents, extract table data, and enable seamless editing and cloud storage integration.

## Features

- **Advanced OCR Recognition**: Uses Apple's Vision framework for accurate handwriting recognition
- **Table Extraction**: Automatically parses recognized text into structured table format
- **Live Editing**: Edit extracted table data in real-time with an intuitive interface
- **Confidence Indicators**: Visual feedback showing OCR confidence levels for each cell
- **Supabase Integration**: Upload extracted data to Supabase for cloud storage and data ingestion
- **Multiple Input Methods**: Select images from photo library or capture directly with camera
- **Export Options**: Export data as JSON or CSV formats
- **Modern SwiftUI**: Built with iOS 17+ using Swift 5.9+ features including @Observable macro and #Preview

## Technology Stack

- **SwiftUI** - Modern declarative UI framework
- **Vision Framework** - Apple's native OCR and text recognition
- **Combine** - Reactive programming for data flow
- **Supabase Swift SDK** - Cloud database integration
- **PhotosUI** - Native photo picker integration
- **Swift Package Manager** - Dependency management

## Architecture

The app follows MVVM (Model-View-ViewModel) architecture:

```
handwriting-scanner/
├── HandwritingScanner.xcodeproj/     ← Xcode project
└── HandwritingScanner/               ← iOS app source
    ├── HandwritingScannerApp.swift   (App entry point)
    ├── Models/
    │   ├── TableData.swift
    │   └── OCRResult.swift
    ├── ViewModels/
    │   └── ScannerViewModel.swift
    ├── Views/
    │   ├── MainView.swift
    │   ├── ScannerView.swift
    │   ├── TableEditorView.swift
    │   ├── EditableTableView.swift
    │   ├── ProcessingView.swift
    │   ├── ErrorView.swift
    │   └── ImagePicker.swift
    ├── Services/
    │   ├── OCRService.swift
    │   └── SupabaseService.swift
    ├── Assets.xcassets/
    └── Info.plist
```

## Getting Started

### Prerequisites

- Xcode 15.0 or later
- iOS 17.0 or later
- Swift 5.9 or later
- A physical iOS device or simulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd handwriting-scanner
```

2. Open the project in Xcode:
```bash
open HandwritingScanner.xcodeproj
```

Or double-click `HandwritingScanner.xcodeproj` in Finder

3. **Wait for Swift Package dependencies to resolve:**
   - Xcode will automatically download Supabase Swift SDK
   - This may take 1-2 minutes on first launch
   - Watch the progress in the top status bar

4. **Select an iOS simulator:**
   - Click the device selector in the toolbar
   - Choose "iPhone 15 Pro" or any iOS simulator
   - Or connect a physical iPhone/iPad

5. **Build and run:**
   - Press `Cmd + R` (or click the Play button)
   - The app will build and launch on your device

### Supabase Configuration

The app currently runs in **mock mode** for development. To enable real Supabase integration:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create the following tables in your Supabase project:

```sql
-- Table for storing table metadata
CREATE TABLE table_data (
    id UUID PRIMARY KEY,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_name TEXT
);

-- Table for storing individual cell data
CREATE TABLE table_cells (
    id UUID PRIMARY KEY,
    table_id UUID REFERENCES table_data(id) ON DELETE CASCADE,
    row INTEGER NOT NULL,
    column INTEGER NOT NULL,
    content TEXT NOT NULL,
    confidence REAL NOT NULL
);
```

3. Update the `SupabaseService.swift` file:
   - Set `isMockMode = false`
   - Add your Supabase URL and anon key in the app initialization:

```swift
supabaseService.configure(
    url: "YOUR_SUPABASE_URL",
    anonKey: "YOUR_SUPABASE_ANON_KEY"
)
```

## Usage

### Scanning a Document

1. Launch the app
2. Choose either:
   - **Select from Library**: Pick an existing image from your photo library
   - **Take Photo**: Capture a new photo using your device camera

3. The app will automatically:
   - Process the image using OCR
   - Extract text from the image
   - Structure the text into a table format
   - Display confidence levels for each cell

### Editing Table Data

1. Tap any cell to edit its content
2. Press Return/Enter or tap outside to save changes
3. Use the menu button to:
   - Add new rows
   - Add new columns
4. Delete rows or columns using the trash icons
5. Cells are color-coded by confidence:
   - Green: High confidence (>90%)
   - Yellow: Medium confidence (70-90%)
   - Red: Low confidence (<70%)

### Uploading to Supabase

1. Review and edit the extracted data
2. Tap "Upload to Supabase"
3. The data will be uploaded to your Supabase database
4. You'll receive a confirmation when upload is complete

### Exporting Data

1. Tap "Export Data"
2. Choose format:
   - **JSON**: Structured data with metadata
   - **CSV**: Comma-separated values for spreadsheets
3. Share or save the exported file

## Key Features Explained

### OCR Service
The `OCRService` uses Apple's Vision framework with the following configuration:
- Recognition level: Accurate (optimized for handwriting)
- Language correction: Enabled
- Supports English language by default

### Table Parser
The intelligent table parser:
- Groups text by vertical position (rows)
- Sorts text by horizontal position (columns)
- Handles irregular spacing
- Maintains spatial relationships

### Mock Supabase Service
The app includes a complete mock implementation for development:
- Simulates network delays
- Logs operations to console
- Allows testing without backend setup
- Easy toggle to production mode

## Development

### Running Tests

```bash
swift test
```

### Building for Release

```bash
swift build -c release
```

## Camera and Photo Permissions

The app requires the following permissions (configured in Info.plist):
- **Camera Access**: To capture photos of documents
- **Photo Library Access**: To select existing images

Users will be prompted for these permissions on first use.

## Future Enhancements

Potential features for future releases:
- Support for multiple languages
- Batch processing of multiple images
- Custom table templates
- Advanced editing features (merge cells, split cells)
- Offline data persistence
- Document scanning with automatic edge detection
- Support for handwritten forms and checkboxes

## Troubleshooting

### OCR not recognizing text
- Ensure good lighting when capturing photos
- Make sure text is clear and legible
- Try adjusting the image angle for better recognition

### Camera not working
- Check that camera permissions are granted in Settings
- Restart the app if camera preview doesn't appear

### Upload failing
- Verify your Supabase credentials
- Check your internet connection
- Ensure tables are created in your Supabase project

## License

This project is available for use under standard software licensing terms.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
