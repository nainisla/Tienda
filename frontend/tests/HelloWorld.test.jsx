// src/tests/HelloWorld.test.jsx (CORRECCIÓN)
import { render, screen } from '@testing-library/react';
// 🟢 CLAVE: Importar las funciones de Vitest (test y expect)
import { test, expect } from 'vitest'; 

import HelloWorld from '../src/components/HelloWorld.jsx';

test('renders HelloWorld with name', () => {
  render(<HelloWorld name="Joaquin" />);
  // Usamos un matcher de jest-dom, que ya configuramos en setupTests.js
  expect(screen.getByText('Hello, Joaquin!')).toBeInTheDocument();
});