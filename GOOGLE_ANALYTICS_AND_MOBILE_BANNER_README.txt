SattViva Naturals update

1. The accidental Markdown code fences around apps/web/index.html have been removed. The file is now plain HTML.
2. Mobile banner container is taller on phones (4:3), 16:9 on small tablets, and wide on desktop. Banner images use object-contain so the full image remains visible.
3. Google Analytics initializes only when a real GA4 Measurement ID is set, and React route changes send page views.
4. IMPORTANT: Set VITE_GA_MEASUREMENT_ID in apps/web/.env and your production frontend environment to the actual new ID from Google Analytics (format G-XXXXXXXXXX). The placeholder currently in .env is not a real ID.
5. Rebuild and redeploy the frontend after setting the ID. Test the homepage and several routes on a phone and verify Reports > Realtime in GA4.
