# Handwriting Scanner

A cross-platform mobile app that converts handwritten documents into editable digital tables using OCR (Optical Character Recognition).

## Features

- **Camera & Photo Library**: Capture new photos or select existing images
- **OCR Processing**: Uses Google ML Kit for accurate text recognition
- **Smart Table Detection**: Automatically parses handwritten text into table structure
- **Confidence Scoring**: Visual indicators show OCR reliability (green/yellow/red)
- **Editable Tables**: Tap to edit any cell, add/remove rows and columns
- **Export Options**: Export as JSON or CSV
- **Cloud Storage**: Upload tables to Supabase for backup and sync
- **Authentication**: Email/password authentication with Supabase Auth

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) SDK 54 with React Native
- **Language**: TypeScript
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Styling**: [NativeWind](https://www.nativewind.dev/) v4 (Tailwind CSS)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Backend**: [Supabase](https://supabase.com/) (Auth + Database)
- **OCR**: [@infinitered/react-native-mlkit-text-recognition](https://github.com/infinitered/react-native-mlkit)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- iOS Simulator (Mac) or Android Emulator
- Physical device recommended for OCR testing (ML Kit doesn't work in iOS Simulator)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd handwriting-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure Supabase (optional - app works in demo mode without it):
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Running the App

**Development Build Required**: This app uses ML Kit which requires native code. You cannot use Expo Go.

```bash
# Create development build
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Demo Mode

The app runs in demo mode without Supabase credentials:
- Authentication is simulated
- OCR uses mock data in iOS Simulator (use physical device for real OCR)
- Upload to cloud is simulated

## Project Structure

```
handwriting-scanner/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   └── scan/              # Scanning flow
├── components/
│   ├── ui/                # Reusable UI components
│   ├── table/             # Table-related components
│   └── scanner/           # Scanner components
├── store/                 # Zustand state stores
├── lib/                   # Services (Supabase, OCR)
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── ios-archive/           # Original iOS Swift project
```

## Supabase Setup

If you want to use real cloud storage, create these tables in Supabase:

```sql
-- Table for storing table metadata
CREATE TABLE table_data (
    id UUID PRIMARY KEY,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_name TEXT,
    user_id UUID REFERENCES auth.users(id)
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

-- Enable RLS
ALTER TABLE table_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_cells ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own data" ON table_data
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cells" ON table_cells
    FOR ALL USING (
        table_id IN (SELECT id FROM table_data WHERE user_id = auth.uid())
    );
```

## Key Files

| File | Description |
|------|-------------|
| `lib/ocr.ts` | OCR service wrapper with table parsing |
| `utils/tableParser.ts` | Algorithm to convert text to table structure |
| `store/tableStore.ts` | Table state and operations |
| `components/table/EditableTable.tsx` | Main table editor component |
| `app/(tabs)/index.tsx` | Main scanner screen |
| `app/scan/editor.tsx` | Table editor screen |

## iOS Archive

The original iOS Swift/SwiftUI implementation is preserved in `ios-archive/` for reference.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
