UGHE Test Web App - Next.js frontend
====================================

The Next.js homepage fetches its displayed site settings, header actions,
navigation, slides, and stats from the Django endpoint at /api/home/. Carousel
slides support image and muted looping video content. The mobile navigation
and slide controls are keyboard accessible.

Run all services with Docker Compose from the project root; see ../readme.txt.
The default public API origin is http://localhost:8000 and can be changed with
NEXT_PUBLIC_API_URL in the root .env file. The API origin is read by the
browser, so it must be reachable from the user's browser.

Run frontend only
-----------------
Install packages with `npm ci`, set NEXT_PUBLIC_API_URL, then run `npm run dev`.
Open http://localhost:3000. Use `npm run lint` and `npm run build` for checks.

Museo Slab
----------
The project-supplied Museo Slab font files are in public/assets/font and are
self-hosted with Next.js next/font/local. No remote font service is called.
