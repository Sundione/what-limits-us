import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  site: "https://sundione.github.io",
  base: "/what-limits-us/",
  integrations: [preact()],
});
