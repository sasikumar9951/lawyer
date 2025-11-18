# Color Scheme Reference - Cases Management Page

## Background Colors

- **Main Container**: `bg-blue-50` - Light blue background for the entire page
- **Cards**: `bg-white/90 backdrop-blur` - Semi-transparent white cards with blur effect
- **Table Row Hover**: `bg-blue-50/60` - Light blue hover state for table rows

## Text Colors

### Primary Text Colors

- **Main Headings**: `text-blue-900` - Used for "Cases Management" title, customer names, service names, table index numbers
- **Secondary Headings**: `text-blue-700` - Used for descriptions, customer email/phone, service category, lawyer email, dates, pagination info, switch labels
- **Table Headers**: `text-blue-800` - Used for all table column headers and form labels
- **Form Labels**: `text-blue-800` - Used for all filter form labels

### Muted/Supporting Text

- **Muted Text**: `text-blue-700/80` - Used for customer details (email, phone), service category, lawyer email, "no cases found" message
- **Not Assigned**: `text-blue-400` - Used for "Not assigned" lawyer status
- **Loading Text**: `text-gray-600` - Used for loading spinner text

## Border Colors

- **Card Borders**: `border-blue-100` - Used for card component borders
- **Input/Select Borders**: `border-blue-200` - Used for form inputs, selects, and outline buttons
- **Loading Spinner**: `border-b-2 border-blue-600` - Blue loading spinner border

## Button Colors

### Primary Buttons

- **Primary State**: `bg-blue-600 hover:bg-blue-700 text-white` - Used for "View Details", "Enable All", pagination active state
- **Disabled State**: `disabled:opacity-50` - Applied to disabled buttons

### Secondary Buttons

- **Outline State**: `border-blue-200 text-blue-700 hover:bg-blue-100` - Used for pagination buttons, "First"/"Last" buttons

### Destructive Buttons

- **Destructive State**: `bg-red-600 hover:bg-red-700 text-white` - Used for "Disable All" button

## Status Badge Colors

- **Pending**: `bg-yellow-100 text-yellow-800`
- **In Progress**: `bg-blue-100 text-blue-800`
- **Completed**: `bg-green-100 text-green-800`
- **Cancelled**: `bg-red-100 text-red-800`
- **Default**: `bg-gray-100 text-gray-800`

## Interactive Elements

### Focus States

- **Input Focus**: `focus-visible:ring-blue-500` - Blue ring for input focus
- **Select Focus**: `focus:ring-blue-500` - Blue ring for select focus

### Select Items

- **Focus State**: `[&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white` - Blue background with white text for focused select items

### Switches

- **Checked State**: `data-[state=checked]:bg-blue-600` - Blue background for checked switches

## Dialog Colors

- **Enable Action**: `bg-blue-600 hover:bg-blue-700 text-white` - For "Enable All" in dialog
- **Disable Action**: `bg-red-600 hover:bg-red-700 text-white` - For "Disable All" in dialog

## Current Color Palette Summary

- **Primary Blue**: `blue-600` (buttons, switches, focus states)
- **Dark Blue**: `blue-900` (main headings, important text)
- **Medium Blue**: `blue-800` (table headers, form labels)
- **Light Blue**: `blue-700` (secondary text, descriptions)
- **Lighter Blue**: `blue-400` (inactive states)
- **Very Light Blue**: `blue-50` (background, hover states)
- **Blue Borders**: `blue-100` (subtle borders), `blue-200` (form borders)

## Notes

- There's a typo in line 634: `text-red-700` should be `text-blue-700` for the "Last" button
- All colors follow a consistent blue theme with proper contrast ratios
- Status badges use semantic colors (yellow for pending, green for completed, red for cancelled)
