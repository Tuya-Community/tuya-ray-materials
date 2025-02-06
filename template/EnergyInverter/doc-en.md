# PV Inverter Home Module Documentation

## Overview

The home module (`src/pages/home/index.tsx`) is the core page of the PV inverter system, providing device status monitoring, power generation data display, and quick navigation features.

## Main Features

### 1. Device Status Display
- Device name display
- Real-time online/offline status
- Working mode display

### 2. Performance Metrics
- Device score display
- Net output display (kWh)
- Power flow visualization

### 3. Income Information
- Feed-in tariff income
- Daily income statistics
- Cumulative income display

### 4. Quick Navigation
- PV Generation Info Entry (`/pvInfo`)
  - Display daily power generation (kWh)
- Energy Storage Info Entry (`/energyStorageInfo`)
  - Display current battery percentage

## Technical Implementation

### Data Management
- Using Redux for state management
- Getting device info through `useSelector`
- Using `useDevice` to get device name

### Lifecycle
- On component mount, get device info through `useEffect`
- On component unmount, clear device info through `useEffect`

### Styling
- Using `styled-components` for style encapsulation
- Theme colors configuration through `theme`

## Code Structure

```tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDevice } from 'hooks';
import { getDeviceInfo } from 'api';
import { setDeviceInfo } from 'store/actions';
```

## Important Notes

1. Performance Optimization
   - Using `useMemo` to cache computation results
   - Using `useCallback` to optimize callback functions
   - Avoiding unnecessary re-renders

2. Error Handling
   - Adding data loading failure handling
   - Displaying prompts for network exceptions
   - Supporting manual refresh functionality

3. Compatibility
   - Supporting different screen sizes
   - Adapting to dark/light themes
   - Considering offline mode support

## Future Improvements

1. Data Display
   - Adding more data visualization charts
   - Optimizing data update frequency
   - Supporting customizable data display items

2. User Experience
   - Adding animation effects
   - Optimizing loading state display
   - Adding operation guidance

3. Feature Extensions
   - Supporting multi-device switching
   - Adding alarm information display
   - Integrating weather information
