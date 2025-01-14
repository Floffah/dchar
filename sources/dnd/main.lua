local Source = {
    name = "Dungeons & Dragons Base",
    author = "DChar Contributors",
    description = "Implements all the base functionality for a dungeons and dragons flavoured DChar character sheet. Does not include actual D&D source content",
    extends = {"base"},
    lib = true,
}

function Source.onload()
    variable("characterBackstory", "Once upon a time...")
    
    local detailsSection = builtinsections.details()
    
    detailsSection.field("characterBackstory", {
        label = "Character Backstory",
        type = "textarea",
        variable = "characterBackstory",
        default = "Once upon a time...",
    })
end

return Source