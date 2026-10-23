# G3co

G3co (pronounced "Gecko" 🦎) is a web app for designing 3D-printable business cards. Personalise it to your own liking, then download it as an `.stl` file.

It was created by [Roberto Reyes](https://github.com/Axolodev) to learn more about 3D object management with [React Three Fiber](https://r3f.docs.pmnd.rs/).

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Cache Components, React Compiler) and React 19
- [three.js](https://threejs.org) with `@react-three/fiber`, `@react-three/drei` and `@react-three/csg`
- [Tailwind CSS](https://tailwindcss.com) 4 and [daisyUI](https://daisyui.com) 5
- [zustand](https://zustand.docs.pmnd.rs) for state, [next-intl](https://next-intl.dev) for translations
- [Vitest](https://vitest.dev), Testing Library and [Storybook](https://storybook.js.org) for tests and component development

## Getting started

You need Node.js 22 or newer (CI runs on 22) and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** this project uses a recent Next.js with breaking changes from older versions. Before changing framework-level code, read the relevant guide in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)).

## Scripts

| Command                   | What it does                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run dev`             | Start the development server.                                     |
| `npm run build`           | Create a production build.                                        |
| `npm start`               | Serve the production build.                                       |
| `npm run lint`            | Run ESLint.                                                       |
| `npm test`                | Run the unit tests (the Vitest `unit` project, using jsdom).      |
| `npm run storybook`       | Start Storybook on [http://localhost:6006](http://localhost:6006). |
| `npm run build-storybook` | Build a static Storybook.                                         |

CI ([`.github/workflows/test.yml`](.github/workflows/test.yml)) runs `npm ci`, `npm test` and `npm run build` on every push.

The Vitest config also defines a `storybook` project that runs the stories in headless Chromium through Playwright. It isn't part of `npm test`; run it with `npx vitest run --project storybook`. You may need to install the browser first with `npx playwright install chromium`.

## Project structure

```
src/
  app/            Next.js App Router: layout, page, global styles, icons
  components/     UI: CardForm, FormFields, Visualizer, Modal, WelcomeModal, ...
    3d/           React Three Fiber meshes: card, QR code, text block, container
  i18n/           next-intl setup, LocaleProvider, en.json / es.json messages
  store/          zustand stores (form state, mesh/export) and localStorage hydration
  theme/          Theme list, cookie handling and ThemeProvider
public/fonts/     Typeface JSON files used to generate the 3D text
.storybook/       Storybook configuration
```

Tests live next to the code they cover, as `*.spec.ts(x)`.

## Contributing

Bug reports and ideas are welcome on the [GitHub issue tracker](https://github.com/Axolodev/biscard/issues). Before opening a pull request, run `npm run lint`, `npm test` and `npm run build`.
