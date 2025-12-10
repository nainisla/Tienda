import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import FacebookLogin from "../src/components/FacebookLogin.jsx";

test("muestra el botón de login cuando FB está disponible", () => {
  global.FB = { getLoginStatus: () => {} };

  render(<FacebookLogin onLoginSuccess={() => {}} />);

  expect(
    screen.getByRole("button", { name: /facebook/i })
  ).toBeInTheDocument();
});


test("el botón se deshabilita mientras intenta iniciar sesión", () => {
  global.FB = {
    login: () => {}
  };

  render(<FacebookLogin onLoginSuccess={() => {}} />);

  const btn = screen.getByRole("button", { name: /facebook/i });

  fireEvent.click(btn);

  expect(btn).toBeDisabled();
});

