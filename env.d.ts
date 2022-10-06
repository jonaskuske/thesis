/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

export declare global {
  interface Navigator {
    virtualKeyboard: { overlaysContent: boolean }
  }
}