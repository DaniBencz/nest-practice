# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev      # Run with hot reload (development)
npm run build          # Compile TypeScript via nest build
npm run test           # Run unit tests (jest, rootDir: src)
npm run test:watch     # Run unit tests in watch mode
npm run test:cov       # Run unit tests with coverage
npm run test:e2e       # Run e2e tests (test/jest-e2e.json config)
npm run lint           # ESLint with auto-fix
npm run format         # Prettier format
```

Run a single test file:
```bash
npx jest src/app.controller.spec.ts
```

## Architecture

This is a NestJS REST API serving a `GET|POST|PUT|DELETE /users` resource. All data is stored in-memory in `AppService` (no database).

**Request pipeline** (outermost → innermost):

1. **Global exception filter** ([src/filters/all-exceptions.filter.ts](src/filters/all-exceptions.filter.ts)) — catches all unhandled errors. Maps `Error` messages containing `"No user"` to 404; passes `HttpException` through; everything else becomes 500.
2. **Guard** ([src/guards/admin.guard.ts](src/guards/admin.guard.ts)) — `AdminGuard` is applied only to `PUT /users/:id`; it checks `body.admin === true` to allow the request.
3. **Pipes** — `ParseIntPipe` (built-in, converts string params to integers), `IsPositivePipe` ([src/pipes/is-positive.pipe.ts](src/pipes/is-positive.pipe.ts)) (custom, rejects non-positive numbers), and `ValidationPipe` (built-in, uses `class-validator` decorators on `UserDto` for `POST` body).
4. **Controller** ([src/app.controller.ts](src/app.controller.ts)) — thin; delegates everything to `AppService`.
5. **Service** ([src/app.service.ts](src/app.service.ts)) — business logic; throws plain `Error` (not `HttpException`) for not-found cases, which the global filter converts to 404.

**DTO** ([src/dto/user.dto.ts](src/dto/user.dto.ts)) — `UserDto` is used as both the request body shape and the in-memory data model. `class-validator` decorators are active on `name` (string, min 3 chars) and `admin` (optional boolean); `age` has the decorator commented out.

**Error handling convention:** Service throws plain `Error` with messages like `"No user found..."`. The global filter matches on that message string to decide the HTTP status — keep error messages consistent with the existing patterns when adding new service methods.

## Testing

Unit tests live alongside source files (`*.spec.ts` in `src/`). The `AppController` spec uses a real `AppService` instance (not mocked), so tests exercise the full unit stack. E2e tests live in `test/` and use `supertest` against a real NestJS app instance.
