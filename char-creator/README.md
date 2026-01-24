# Shimmering Reach Character Creator

A web-based character creator for the Shimmering Reach game system, built with React, TypeScript, and Vite.

## Features

- **Attributes System**: 9 attributes (BOD, AGI, REA, STR, WIL, INT, LOG, CHA, LUK) with dynamic BP cost calculation
- **Magic System**: Tradition levels (1-10) with customizable cast stat and 5-color affinity allocation (W/U/B/R/G)
- **Skills System**: Parent skills, individual skills, and knowledge skills with automatic dicepool calculation
- **Abilities Database**: 591 abilities with search, filtering, and affinity requirement checking
- **Weapons System**: Customizable weapons with dicepool calculation
- **Character Stats**: Automatic calculation of HP, Stamina, Drain, Defense, Resist, and Soak stats
- **BP Budget Tracking**: Real-time BP cost tracking with over-budget warnings
- **Persistence**: Save/load to browser storage and import/export JSON files

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.tsx           # Character name, save/load, BP display
│   ├── AttributesPanel.tsx  # 9 attributes with costs
│   ├── MagicPanel.tsx       # Tradition, cast stat, affinities
│   ├── SkillsPanel.tsx      # Skills with dicepools
│   ├── StatsPanel.tsx       # Computed stats (HP, Defense, etc.)
│   ├── AbilitiesPanel.tsx   # Ability search and selection
│   ├── WeaponsPanel.tsx     # Weapon management
│   └── NotesPanel.tsx       # Notes and inventory
├── context/          # React Context for state management
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── calculations.ts      # Core game formulas
│   ├── storage.ts           # localStorage functions
│   └── import-export.ts     # JSON import/export
└── data/             # Static data files
    ├── abilities.json       # 591 abilities from Excel
    └── skills.json          # Skills database
```

## Core Formulas

### Attributes
- Cost: `(value² + value - 2) × 2.5`
- Range: 1-10

### Tradition
- Cost: `(tradition² + 7×tradition - 8) × 2.5`
- Affinity Points: `tradition × 3`

### Skills
- Cost: `(rank² + rank + 2) × multiplier`
  - Parent skills: multiplier = 2.5
  - Individual skills: multiplier = 1.0
  - Knowledge skills: multiplier = 0.5
- Dicepool: `⌈tradition/2⌉ + rank + attribute`

### Health Pools
- HP: `16 + BOD`
- Stamina: `16 + WIL`
- Drain: `16 + Cast_Stat`
- Luck: `LUK`

### Defense
- Dodge (Passive): `INT + REA`
- Dodge (Active): `INT + REA + skill + ⌈tradition/2⌉`
- Parry: `INT + REA + skill + ⌈tradition/2⌉`
- Block: `INT + REA + skill + ⌈tradition/2⌉`

### Resist
- Physical: `BOD + AGI`
- Mental: `WIL + CHA`
- DV Threshold: `BOD`

### Soak
- Armor: `⌈(2×BOD + LOG)/2⌉`
- Physical: `⌈(AGI + 2×STR)/2⌉`
- Mental: `⌈(2×WIL + CHA)/2⌉`
- Drain: `2×WIL`

### BP Budget
- Total BP Spent: `Attributes + Tradition + Skills + Abilities - Knowledge_Discount`
- Knowledge Discount: `(LOG + INT) × 10`
- Default Budget: 1620 BP (configurable)

## Data Files

### abilities.json
Generated from the Excel file using:
```bash
npm run parse-excel
```

Contains all 591 abilities with:
- Category (Aura, Buff, Maneuver, Passive, Spell, etc.)
- Name, Description, Rules Text
- BP Cost (single or multi-rank)
- Affinity Requirements
- Color Contributions (W/U/B/R/G)

### skills.json
Manually curated skills database with:
- Skill name and type (parent/individual/knowledge)
- Associated attribute
- Cost multiplier
- Category for UI organization

## Save/Load Features

### Browser Storage
- Automatically saves to localStorage
- Click "Save" to save current character
- Click "Load" to load saved character

### JSON Import/Export
- Click "Export" to download character as JSON
- Click "Import" to load character from JSON file
- Portable format for sharing characters

## Future Enhancements

Potential areas for expansion:
- Print-friendly character sheet view
- Character comparison tool
- Dice roller integration
- Party/campaign management
- Cloud sync for multi-device access
- Character templates
- Advanced ability filtering (by color contribution, BP range, etc.)
- Modifier system for abilities that grant stat bonuses

## License

This project is for personal use. The Shimmering Reach game system and all related content are property of their respective owners.
