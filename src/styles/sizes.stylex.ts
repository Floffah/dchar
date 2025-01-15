import stylex from "@stylexjs/stylex";

// General sizes
// Sizes are in rem & baed on tailwind sizing, 1rem = 4 tailwind units
// In a perfect world, this var group has very little in it to keep the UI consistent
export const sizes = stylex.defineVars({
    h_screen: "100vh",
    w_screen: "100vw",

    spacing0_5: "0.125rem",
    spacing1: "0.25rem",
    spacing1_5: "0.375rem",
    spacing2: "0.5rem",
    spacing3: "0.75rem",
    spacing4: "1rem",
    spacing5: "1.25rem",
    spacing6: "1.5rem",
    spacing10: "2.5rem",
});

export const maxWidths = stylex.defineVars({
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
});
