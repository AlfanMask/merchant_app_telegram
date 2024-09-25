/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      textColor: {
        "primary": "#8B929B",
        "secondary": "#FFFFFF",
        "accent": "#5B74E5",
        "dark": "#171824",
        "primary-lp-os-cp-cs": "#040404",
        "secondary-lp-os-cp-cs": "#777777",
        "accent-lp": "#E4720B",
        "accent-os": "#756AB6",
        "accent-cp": "#164863",
        "accent-cs": "#0D7C66",
      },
      backgroundColor: {
        "base": "#171824",
        "primary": "#FFFFFF",
        "secondary": "#8B929B",
        "accent": "#5B74E5",
        "base-lp-os-cp-cs": "#FFFCF7",
        "primary-lp": "#E4720B",
        "accent-lp": "#9E6DC9",
        "primary-os": "#756AB6",
        "accent-os": "#36BA98",
        "primary-cp": "#164863",
        "accent-cp": "#36BA98",
        "primary-cs": "#0D7C66",
        "accent-cs": "#D7C3F1",
      },
      backgroundImage: {
        "blueish-gradient": "var(--blueish-gradient)",
        "accent-gradient": "var(--accent-gradient)",
        "accent-footer-gradient": "var(--accent-footer-gradient)",
        "gradient-lp": "var(--lp-gradient)",
        "gradient-os": "var(--os-gradient)",
        "gradient-cp": "var(--cp-gradient)",
        "gradient-cs": "var(--cs-gradient)",
      },
      borderColor: {
        "secondary": "#8B929B",
      },
      outlineColor: {
        "secondary": "#8B929B",
      },
      colors: {
        "primary-lp": "#E4720B",
        "primary-os": "#756AB6",
        "primary-cp": "#164863",
        "primary-cs": "#0D7C66",
      },
      boxShadow: {
        "lp": "0 4px 24px 12px rgba(158, 109, 201, 1)",
        "os": "0 4px 24px 12px rgba(54, 186, 152, 1)",
        "cp": "0 4px 24px 12px rgba(54, 186, 152, 1)",
      }
    },
  },
  plugins: [],
}