"use client";

import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import NoSimIcon from "~icons/material-symbols/no-sim-outline";
import BinIcon from "~icons/mdi/bin-outline";

import { Icon } from "@/components/Icon";
import {
    CHARACTER_LIST,
    getSavedSourceSets,
    serializeSavableSourceSet,
} from "@/lib/Source/persistence";
import { CharacterSheetVariableConstants } from "@/lib/constants";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export function LoadCharacterSheet() {
    const existingCharacters = useQuery({
        queryKey: ["existingCharacterSheets"],
        queryFn: async () => {
            return getSavedSourceSets();
        },
        staleTime: 0,
    });

    const deleteCharacter = (name: string) => {
        const newCharacters = existingCharacters.data?.filter((character) => {
            const characterName =
                character.variables[
                    CharacterSheetVariableConstants.CHARACTER_NAME
                ]?.value;

            return characterName !== name;
        });

        if (!newCharacters) {
            return;
        }

        localStorage.setItem(
            CHARACTER_LIST,
            JSON.stringify(
                newCharacters.map((set) => serializeSavableSourceSet(set)),
            ),
        );

        existingCharacters.refetch();
    };

    return (
        <div {...stylex.props(styles.container)}>
            <h1 {...stylex.props(styles.heading)}>Load a saved character</h1>

            {!existingCharacters.isLoading &&
                !existingCharacters.data?.length && (
                    <Icon
                        icon={NoSimIcon}
                        {...stylex.props(styles.noCharactersIcon)}
                    />
                )}

            {existingCharacters.data && (
                <div {...stylex.props(styles.characterList)}>
                    {existingCharacters.data.map((character) => {
                        const name =
                            character.variables[
                                CharacterSheetVariableConstants.CHARACTER_NAME
                            ]?.value;

                        if (!name) {
                            return null;
                        }

                        return (
                            <Link
                                key={name}
                                href={`/character?data=${serializeSavableSourceSet(character)}`}
                                {...stylex.props(styles.characterLink)}
                            >
                                <span {...stylex.props(styles.characterName)}>
                                    {name}
                                </span>

                                <span
                                    {...stylex.props(styles.characterSources)}
                                >
                                    {character.sources.join(", ")}
                                </span>

                                <div
                                    {...stylex.props({
                                        flex: "1",
                                    } as StyleXStyles)}
                                />

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        deleteCharacter(name);
                                    }}
                                    {...stylex.props(
                                        styles.characterDeleteButton,
                                    )}
                                >
                                    <Icon
                                        icon={BinIcon}
                                        label="delete"
                                        {...stylex.props(
                                            styles.characterDeleteIcon,
                                        )}
                                    />
                                </button>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const MD_BREAKPOINT = "@media (min-width: 768px)";
const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing2,
    },
    heading: {
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.lg,
        fontWeight: fontWeights.bold,
    },
    noCharactersIcon: {
        margin: {
            default: `auto ${sizes.spacing10}`,
            [MD_BREAKPOINT]: `auto none`,
        },
        height: sizes.spacing6,
        width: sizes.spacing6,
        fontSize: fontSizes.sm,
        color: {
            default: `rgba(from black r g b / 50%)`,
            [DARK]: `rgba(from white r g b / 50%)`,
        },
    },
    characterList: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing2,
        overflowY: "auto",
    },
    characterLink: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing2,
        padding: sizes.spacing2,
        borderRadius: rounded.lg,
        textDecoration: "none",
        color: theme.foreground,
        backgroundColor: {
            default: colours.gray300,
            [DARK]: colours.gray700,
        },
    },
    characterName: {
        fontWeight: fontWeights.semibold,
    },
    characterSources: {
        fontSize: fontSizes.sm,
        color: {
            default: `rgba(from black r g b / 80%)`,
            [DARK]: `rgba(from white r g b / 80%)`,
        },
    },
    characterDeleteButton: {
        background: "none",
        border: "none",
        padding: "none",
    },
    characterDeleteIcon: {
        height: sizes.spacing5,
        width: sizes.spacing5,
        color: colours.red500,
    },
});
