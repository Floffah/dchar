local Source = {
    name = "Dungeons & Dragons 5e",
    version = "2024",
    author = "Wizards of the Coast",
    description = "The fifth edition of the Dungeons & Dragons role-playing game.",
    extends = {"dnd"},
    dependencies = {
        "coreset.lua",
    },
    optional = {},
}

function Source.onload()
    print("hello from lua");
end

return Source