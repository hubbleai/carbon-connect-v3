/** @type {import('tailwindcss').Config} */
import {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} from "tailwindcss-scoped-preflight";
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],

  darkMode: ["selector", '[data-mode="dark"]'], // or 'media' or 'class'
  prefix: "cc-",
  theme: {
    extend: {
      colors: {
        high_em: "#000000",
        low_em: "#0000007a", //rgba(0,0,0,0.48)
        info_em: "#067BF9",
        med_em: "rgba(0, 0, 0, 0.76)",
        success_high_em: "#058F43",
        white: "#FFFFFF",
        "surface-info_main": "#0BABFB",
        "surface-white": "#FFFFFF",

        "surface-surface_1": "rgba(0, 0, 0, 0.04)",
        "dark-surface_1": "rgba(255,255,255, 0.04)",
        "surface-surface_2": "rgba(0, 0, 0, 0.07)",
        "surface-surface_3": "rgba(0, 0, 0, 0.12)",
        "surface-info_accent_1": "#E4FCFF",
        "surface-success_accent_1": "#E3FFEE",
        "surface-danger_accent_1": "#FEF2F2",
        "surface-danger_accent_3": "#FF7373",
        "surface-danger_main": "#F03D3D",
        "surface-warning_accent_1": "#FFFDDC",
        "surface-disabled_low_em": "#E2E2E4",
        "color-black-7": "rgba(0, 0, 0, 0.07)",
        "outline-base_em": "rgba(0, 0, 0, 0.07)",
        "outline-low_em": "rgba(0, 0, 0, 0.12)",
        "outline-med_em": "rgba(0, 0, 0, 0.16)",
        "dark-outline-med_em": "rgba(255, 255, 255, 0.16)",
        "outline-danger_high_em": "#F03D3D",
        disabledtext: "rgba(0, 0, 0, 0.32)",
        "gray-25": "#F8F8F8",
        "gray-50": "#F3F3F4",
        "success-600": "#02B151",
        "warning-600": "#E09400",
        "danger-600": "#DE2424",
        "gradient-blue":
          "linear-gradient(0deg, rgba(31, 123, 245, 0.10) 0%, rgba(31, 123, 245, 0.10) 100%), var(--color-white-20, rgba(255, 255, 255, 0.20)",
        "focus-primary": "#D9D6FE",
        "dark-text-white": "#fff",
        "dark-bg-black": "#0c0c0c",
        "dark-text-gray": "#ffffff7a",
        "dark-border-color": "#ffffff12",
        "dark-input-bg": "#ffffff33",
        "dark-input-text": "#ffffff52",
        "svg-background": "#1f1f1f",
        "custom-gradient-dark":
          "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(0deg, rgba(31, 123, 245, 0.1), rgba(31, 123, 245, 0.1))",
        justifyStart: "flex-start",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        modal: "0px 40px 48px -8px rgba(0, 0, 0, 0.07)",
        logo: "0px 3px 4px -2px (0, 0, 0, 0.16)",
        dropdown: "0px 8px 24px -4px rgba(0, 0, 0, 0.12)",
        "modal-footer-top": "0px -3px 8px -2px #0000001F",
        e2: "0px 3px 4px -2px #00000029",
        e3: "0px 8px 24px -4px #0000001F",
        tooltipShadow: '0px 1px 1px -0.5px  rgba(0, 0, 0, 0.12), 0px 3px 3px -1.5px rgba(0, 0, 0, 0.12), 0px 24px 24px -12px  rgba(0, 0, 0, 0.12)'
      },
      lineHeight: {
        24: "1.5rem",
      },
      width: {
        100: "6.25rem",
        296: "18.5rem",
      },
      fontSize: {
        xxs: ["10px", "16px"],
        xss: ["10px", "16px"],
        smxt: ["14px", "24px"],
        xlxt: ["20px", "32px"],
        "2.5xl": ["26px", "40px"],
      },
 screens: {
        md: { max: "767px" },
        // => @media (max-width: 767px) { ... }

        tab:{min: '768px' , max:'783px'},
        desktop:{min:'1025px' , max:'1280'}
      },

    },
  },

  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer([".cc-modal", ".cc-dropdown-content" , ".cc-popover-content"]),
    }),
  ],
};
