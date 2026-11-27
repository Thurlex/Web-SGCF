# WebSgcf

This project uses Angular 19 and the standalone application API.

## Project structure

- `src/app/core/`: application-wide services, guards, interceptors, and configuration.
- `src/app/features/`: route-level business features, grouped by domain.
- `src/app/shared/`: reusable presentational components, directives, pipes, and utilities.
- `src/app/app.routes.ts`: top-level routes; feature routes should be lazy loaded.

Create these directories when the first matching implementation is added. Keeping the initial
workspace small avoids empty folders and premature abstractions.

## Run the full stack

Run the services in this order from separate terminals:

1. Start PostgreSQL from the repository root:

```powershell
cd ..
cd SGCF_back
docker compose up -d
```

2. Start the Spring Boot API from `SGCF_back`:

```powershell
.\mvnw.cmd spring-boot:run
```

The API uses `localhost:5434` for PostgreSQL and listens on `localhost:8080`.

3. Start Angular from the frontend directory:

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
npm run ng -- generate component features/feature-name/component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Build and deployment

```bash
npm run build
```

Deploy the contents of `dist/web-sgcf/browser/`. Configure the web server to serve
`index.html` for app routes and forward `/api` requests to the backend.

## Running unit tests

Tests use Karma and Jasmine:

```bash
npm test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
