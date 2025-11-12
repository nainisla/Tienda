import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import FacebookLogin from "../src/components/FacebookLogin.jsx";

vi.mock("axios", () => {
  const mockPost = vi.fn();

  return {
    default: {
      post: mockPost,
      get: vi.fn(),
    },
    post: mockPost,
  };
});
const originalCreateElement = global.document.createElement.bind(
  global.document
);
const insertBeforeMock = vi.fn();
global.document.createElement = vi.fn((tagName) => {
  const element = originalCreateElement(tagName);
  element.id = "";
  element.src = "";
  element.async = true;
  return element;
});
global.document.getElementsByTagName = vi.fn((tagName) => {
  if (tagName === "script") {
    return [
      { parentNode: { insertBefore: insertBeforeMock, appendChild: vi.fn() } },
    ];
  }
  return [];
});
const mockFB = {
  login: vi.fn((callback) => {
    const response = {
      status: "connected",
      authResponse: {
        accessToken: "MOCK_FB_ACCESS_TOKEN",
        userID: "12345",
      },
    };
    callback(response);
  }),
  getLoginStatus: vi.fn((callback) => {
    callback({ status: "unknown" });
  }),
};
describe("FacebookLogin", () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    global.FB = mockFB;
    global.fbAsyncInit = vi.fn(() => {
      global.FB.getLoginStatus(() => {});
      global.FB.Event = { subscribe: vi.fn() };
    });
    axios.post.mockClear();
    mockOnLoginSuccess.mockClear();
    insertBeforeMock.mockClear();
  });
  it("1. Debe renderizar el botón y el spinner mientras carga el SDK", () => {
    global.FB = undefined;
    render(<FacebookLogin onLoginSuccess={mockOnLoginSuccess} />);
    expect(
      screen.getByRole("button", { name: /Cargando.../i })
    ).toBeInTheDocument();
  });
  it("2. Debe llamar al backend y a onLoginSuccess tras un login exitoso", async () => {
    const mockBackendResponse = {
      data: {
        session_token: "TEST_TOKEN_FB",
        role: "user",
      },
    };
    axios.post.mockResolvedValue(mockBackendResponse);
    render(<FacebookLogin onLoginSuccess={mockOnLoginSuccess} />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Iniciar sesión con Facebook/i })
      ).toBeInTheDocument();
    });
    const facebookButton = screen.getByRole("button", {
      name: /Iniciar sesión con Facebook/i,
    });
    fireEvent.click(facebookButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        "https://localhost:5000/auth/facebook",
        { accessToken: "MOCK_FB_ACCESS_TOKEN" }
      );
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnLoginSuccess).toHaveBeenCalledWith({
        access_token: "TEST_TOKEN_FB",
        role: "user",
      });
    });
  });

  it("3. Debe manejar el error del backend y mostrar el mensaje", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Token de Facebook Inválido" } },
    });
    render(<FacebookLogin onLoginSuccess={mockOnLoginSuccess} />);
    await waitFor(() => {
      fireEvent.click(
        screen.getByRole("button", { name: /Iniciar sesión con Facebook/i })
      );
    });
    await waitFor(() => {
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
      expect(
        screen.getByText(
          /Error de red o CORS al validar el token en el backend/i
        )
      ).toBeInTheDocument();
    });
  });
});
