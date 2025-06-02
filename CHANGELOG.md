# DebugWindow Changelog

## v1.0.1 - Compact Styling Update

### 🎨 **Styling Changes**
- **Font sizes reduced by 2px across all elements**:
  - Debug title: 14px → 12px
  - Drag icon: 18px → 16px
  - Buttons: 14px → 12px
  - Section titles: 12px → 10px
  - Log items: 11px → 9px
  - Clear logs button: 10px → 8px
  - Config buttons: 12px → 10px
  - Labels (checkbox/radio): 12px → 10px
  - Metrics: 12px → 10px

### 📏 **Spacing Improvements**
- **Reduced vertical paddings for compactness**:
  - Header padding: 8px 12px → 6px 10px
  - Content padding: 12px → 8px
  - Section margins: 16px → 12px
  - Section title margins/padding: 8px/4px → 6px/3px
  - Checkbox/radio item padding: 6px → 4px
  - Metric item padding: 6px 8px → 4px 6px
  - Button margins: 6px → 4px

### 🏷️ **Default Title Change**
- Changed default title from **"Debug Window"** to **"Debug Info"**

### 🚀 **Benefits**
- **More compact appearance** - Better space utilization
- **Improved information density** - More content fits in smaller windows
- **Maintained readability** - Text remains clear and legible
- **Better UX** - Less visual clutter, cleaner interface

---

## v1.0.0 - Initial Release

### ✨ **Core Features**
- Single JavaScript file with embedded CSS
- Draggable by icon only (⋮⋮)
- Single bottom-right resize handle
- localStorage state persistence
- Multiple UI element types
- Dark theme styling
- Comprehensive API (20+ methods)

### 📦 **UI Elements**
- Logs with timestamps and types (info/warning/error)
- Config buttons with click handlers
- Checkboxes with change callbacks
- Radio button groups
- Real-time metrics display
- Auto-clearing and scrollable content

### 🛠️ **Technical**
- Requires Moveable.js dependency
- Browser and Node.js compatible
- MIT licensed
- Complete documentation and examples 