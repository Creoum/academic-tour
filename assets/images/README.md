# 📸 Images Folder

Drop your actual tour photos here, organized by day.

## Folder Structure

```
assets/images/
├── day1/
│   ├── airport.jpg          → Morning: NAIA arrival
│   ├── rizal-park.jpg       → Afternoon: Rizal Park
│   ├── intramuros.jpg       → Afternoon: Intramuros
│   └── manila-cathedral.jpg → Afternoon: Manila Cathedral
│
├── day2/
│   ├── hytec-1.jpg          → Morning: Hytec Power Inc.
│   ├── hytec-2.jpg
│   ├── opentext-1.jpg       → Afternoon: OpenText Philippines
│   └── opentext-2.jpg
│
├── day3/
│   ├── toppeg-1.jpg         → Morning: Top Peg Animation
│   ├── toppeg-2.jpg
│   ├── teleperformance-1.jpg → Afternoon: Teleperformance SE
│   └── teleperformance-2.jpg
│
├── day4/
│   ├── mmda-1.jpg           → Morning: MMDA
│   ├── mmda-2.jpg
│   ├── microsourcing-1.jpg  → Afternoon: MicroSourcing
│   └── microsourcing-2.jpg
│
├── day5/
│   ├── peoples-park-1.jpg   → People's Park in the Sky
│   ├── peoples-park-2.jpg
│   ├── skyranch-1.jpg       → Sky Ranch Tagaytay
│   └── taal-view.jpg        → Taal Lake View
│
├── day6/
│   ├── baguio-1.jpg         → Baguio City
│   └── baguio-road.jpg      → Mountain road
│
└── day7/
    ├── airport-departure.jpg → Departure
    └── flight-home.jpg       → Flight back home
```

## How to use your photos in index.html

Find the slideshow for the day you want to update and replace the `src`:

```html
<!-- BEFORE (Unsplash placeholder) -->
<img src="https://images.unsplash.com/photo-xxx?w=900&q=80" alt="..." />

<!-- AFTER (your real photo) -->
<img src="assets/images/day1/airport.jpg" alt="Our arrival at NAIA" />
```

## Tips

- Recommended size: at least **1200×800px**
- Format: **JPG** or **WEBP** (smaller file size)
- Keep file names lowercase with hyphens, no spaces
