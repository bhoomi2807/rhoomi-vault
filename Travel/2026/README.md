# Travel 2026

Travel plans are organized by destination. Each destination owns its itinerary and any supporting files it needs.

## Destinations

- [Iceland](Iceland/iceland-itenrary.html)
- [New Mexico](New%20Mexico/new-mexico-itinerary.html)

The browser-friendly destination list is maintained in [index.html](index.html).

## Structure

```text
2026/
|-- index.html
|-- Destination Name/
|   |-- destination-itinerary.html
|   |-- styles.css
|   `-- script.js
`-- Another Destination/
	`-- another-destination-itinerary.html
```

A destination can also include optional planning files such as Markdown notes, JSON data, calendar exports, maps, or route files. Keep destination-specific assets inside that destination's folder.

## Adding a Destination

1. Create a folder under `Travel/2026/` using the destination name.
2. Add the destination itinerary and any local assets to that folder.
3. Add a link to the itinerary in [index.html](index.html).
4. Add the destination to the list in this README.

For a trip in another year, create a sibling year folder under `Travel/` with its own `index.html` and destination folders, then link that year from the root Travel navigation.
