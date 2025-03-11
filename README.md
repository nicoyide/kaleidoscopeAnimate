# kaleidoscopeAnimate

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/nicoyide/kaleidoscopeAnimate)

## Overview

This project is a kaleidoscope animation application that was originally built using React and TypeScript. It has now been converted to use Rust and WebAssembly for the frontend.

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/nicoyide/kaleidoscopeAnimate.git
   cd kaleidoscopeAnimate
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Build the Rust code:
   ```sh
   wasm-pack build
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

### Building for Production

To create a production build, run:
```sh
npm run build
```

## Project Structure

- `src/lib.rs`: Main application logic written in Rust.
- `index.html`: Entry point for the application, loads the WebAssembly module.
- `vite.config.ts`: Configuration for Vite, includes the `vite-plugin-wasm-pack` plugin.
- `package.json`: Project dependencies and scripts.

## License

This project is licensed under the MIT License.
