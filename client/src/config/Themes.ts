import { createMuiTheme } from '@material-ui/core/styles';

export const themeMinty = createMuiTheme(
  {
    "palette": {
      "common": {
        "black": "#000",
        "white": "#fff"
      },
      "background": {
        "paper": "rgba(203, 239, 231, 0.12)",
        "default": "rgba(255, 255, 255, 0)"
      },
      "primary": {
        "light": "rgba(182, 235, 229, 1)",
        "main": "rgba(77, 182, 172, 1)",
        "dark": "rgba(54, 128, 119, 1)",
        "contrastText": "#fff"
      },
      "secondary": {
        "light": "rgba(146, 188, 237, 1)",
        "main": "rgba(82, 137, 201, 1)",
        "dark": "rgba(54, 101, 163, 1)",
        "contrastText": "#fff"
      },
      "error": {
        "light": "#e57373",
        "main": "#f44336",
        "dark": "#d32f2f",
        "contrastText": "#fff"
      },
      "text": {
        "primary": "rgba(0, 0, 0, 0.87)",
        "secondary": "rgba(0, 0, 0, 0.54)",
        "disabled": "rgba(0, 0, 0, 0.38)",
        "hint": "rgba(0, 0, 0, 0.38)"
      }
    }
  }
);