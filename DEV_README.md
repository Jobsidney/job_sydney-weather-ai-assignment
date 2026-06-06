# Development Setup

## Mock Data System

This project includes a comprehensive mock data system to avoid making API requests during development.

### Quick Start

1. **Default Configuration**: Mock data is enabled by default for development
2. **Toggle via Dev Panel**: Look for the red "DEV" button in the bottom-right corner
3. **Individual API Control**: Toggle specific APIs between mock and live data

### Configuration

Edit `src/config/dev.ts`:

```typescript
export const DEV_CONFIG = {
  // Global mock data toggle
  USE_MOCK_DATA: true,
  
  // Individual API toggles
  ENABLE_API_CALLS: {
    weather: false,      // Main weather data
    insights: false,     // Pro insights
    forecast14: false,   // 14-day forecast
    usage: false,        // Usage statistics
  },
  
  // Simulate API delays
  MOCK_DELAYS: {
    weather: 500,   // 500ms delay
    insights: 800,  // 800ms delay  
    forecast14: 600, // 600ms delay
    usage: 200,     // 200ms delay
  }
}
```

### Mock Data Files

- `src/data/mock-weather.json` - Weather, hourly, and daily forecast data
- `src/data/mock-usage.json` - API usage statistics
- `src/data/mock-insights.json` - Pro insights and recommendations

### Features

- **Location Variations**: Mock data adapts based on latitude/longitude
- **Realistic Delays**: Simulates API response times
- **Pro Feature Testing**: Test upgrade prompts without hitting limits
- **Development Panel**: Runtime toggles for quick testing

### Production

Mock data is automatically disabled in production builds. The dev panel won't appear in production.

## Development Commands

```bash
# Start with mock data (default)
npm run dev

# Build for production (disables mock data)
npm run build

# Type checking
npm run type-check
```

## API Integration

When ready to test with real APIs:

1. Use the dev panel to toggle specific APIs
2. Set `USE_MOCK_DATA: false` in dev config
3. Ensure your `.env` file has the correct API key

The app will seamlessly switch between mock and real data without code changes.