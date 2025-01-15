"use client";

import * as Tabs from "@radix-ui/react-tabs";
import stylex, { StyleXStyles } from "@stylexjs/stylex";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import EyeIcon from "~icons/mdi/eye-outline";
import HomeIcon from "~icons/mdi/home-outline";
import PencilIcon from "~icons/mdi/pencil-outline";

import { EditCharacter } from "@/app/character/EditCharacter";
import { LoadingSourcesLoader } from "@/app/character/LoadingSourcesLoader";
import { Button } from "@/components/Button";
import { useVariable } from "@/hooks/sources";
import { CharacterSheetVariableConstants } from "@/lib/constants";
import { useSources } from "@/providers/SourcesProvider";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";

export default function CharacterPage() {
    const router = useRouter();
    const sources = useSources();

    const characterName = useVariable(
        CharacterSheetVariableConstants.CHARACTER_NAME,
    );

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (!params.has("data")) {
            router.replace("/");
        }
    }, []);

    if (sources.isLoading) {
        return <LoadingSourcesLoader />;
    }

    return (
        <Tabs.Root defaultValue="edit" {...stylex.props(styles.container)}>
            <header {...stylex.props(styles.headerSection)}>
                <Button size="sm" color="secondary" icon={HomeIcon} asChild>
                    <Link href="/">Home</Link>
                </Button>

                <span {...stylex.props(styles.sheetTypeText)}>
                    Character Sheet
                </span>

                <h1 {...stylex.props(styles.characterName)}>{characterName}</h1>

                {/* TODO: abstract tabs to their own component */}
                <Tabs.List {...stylex.props(styles.tabButtonList)}>
                    <Tabs.Trigger
                        value="view"
                        {...stylex.props(styles.tabButton, {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        } as unknown as StyleXStyles)}
                    >
                        <EyeIcon />
                        View
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="edit"
                        {...stylex.props(styles.tabButton, {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        } as unknown as StyleXStyles)}
                    >
                        <PencilIcon />
                        Edit
                    </Tabs.Trigger>
                </Tabs.List>
            </header>

            <Tabs.Content
                value="view"
                {...stylex.props(styles.viewTabContentBox)}
            >
                <p>
                    Page content not implemented yet. Click the edit button to
                    prepare
                </p>
            </Tabs.Content>

            <Tabs.Content
                value="edit"
                {...stylex.props(styles.editTabContentBox)}
            >
                <EditCharacter />
            </Tabs.Content>
        </Tabs.Root>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: sizes.h_screen,
        boxSizing: "border-box",
        gap: sizes.spacing4,
        padding: sizes.spacing4,
    },
    headerSection: {
        display: "flex",
        gap: sizes.spacing2,
        alignItems: "center",
        padding: sizes.spacing2,
        borderRadius: rounded.lg,
        backgroundColor: {
            default: colours.gray200,
            [DARK]: colours.gray800,
        },
    },
    sheetTypeText: {
        height: "fit-content",
        borderRadius: rounded.base,
        padding: sizes.spacing1,
        backgroundColor: {
            default: colours.blue200,
            [DARK]: colours.blue900,
        },
        fontWeight: fontWeights.semibold,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base,
    },
    characterName: {
        fontSize: fontSizes.xl,
        lineHeight: fontSizes.xl,
        fontWeight: fontWeights.bold,
    },

    tabButtonList: {
        display: "flex",
        marginLeft: "auto",
    },
    tabButton: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing1,
        padding: `${sizes.spacing1} ${sizes.spacing2}`,
        borderRadius: rounded.base,
        border: {
            default: `1px solid ${colours.gray300}`,
            [DARK]: `1px solid ${colours.gray700}`,
        },
        background: "none",
        backgroundColor: {
            ":hover": {
                default: colours.gray300,
                [DARK]: colours.gray700,
            },
            ":is([data-state=active])": {
                default: colours.gray300,
                [DARK]: colours.gray700,
            },
        },
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm,
        cursor: "pointer",
    },

    viewTabContentBox: {
        margin: "auto auto",
    },
    editTabContentBox: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: sizes.spacing2,
    },
});
