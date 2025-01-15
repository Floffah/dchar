import stylex from "@stylexjs/stylex";

import { CreateCharacterForm } from "@/app/CreateCharacterForm";
import { LoadCharacterSheet } from "@/app/LoadCharacterSheet";
import { Divider } from "@/components/Divider";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export default function Home() {
    return (
        <div {...stylex.props(styles.container)}>
            <main {...stylex.props(styles.modal)}>
                <CreateCharacterForm />

                <Divider
                    orientation="vertical"
                    {...stylex.props(styles.verticalDivider)}
                >
                    OR
                </Divider>
                <Divider
                    orientation="horizontal"
                    {...stylex.props(styles.horizontalDivider)}
                >
                    OR
                </Divider>

                <LoadCharacterSheet />
            </main>
        </div>
    );
}

const MD_BREAKPOINT = "@media (min-width: 768px)";
const styles = stylex.create({
    container: {
        display: "flex",
        height: sizes.h_screen,
        alignItems: "center",
        justifyContent: "center",
        padding: sizes.spacing4,
    },
    modal: {
        display: "flex",
        flexDirection: {
            default: "column",
            [MD_BREAKPOINT]: "row",
        },
        gap: sizes.spacing4,
        borderRadius: rounded.lg,
        backgroundColor: theme.modalBackground,
        padding: sizes.spacing4,
    },

    verticalDivider: {
        display: {
            default: "none !important",
            [MD_BREAKPOINT]: "flex !important",
        },
    },
    horizontalDivider: {
        display: {
            default: "flex !important",
            [MD_BREAKPOINT]: "none !important",
        },
    },
});
