import stylex from "@stylexjs/stylex";

import { Loader } from "@/components/Loader";
import { colours } from "@/styles/colours.stylex";
import { fontSizes } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export function LoadingSourcesLoader() {
    return (
        <div {...stylex.props(styles.container)}>
            <Loader {...stylex.props(styles.loader)} />
            <p {...stylex.props(styles.text)}>Loading sources...</p>
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        minHeight: sizes.h_screen,
        minWidth: sizes.w_screen,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: sizes.spacing2,
        color: {
            default: colours.gray400,
            [DARK]: colours.gray600,
        },
    },
    loader: {
        height: sizes.spacing6,
        width: sizes.spacing6,
    },
    text: {
        fontSize: fontSizes.sm,
    },
});
