local Source = {
    name = "Base Source",
    author = "DChar Contributors",
    description = "Implements all the base functionality for a DChar character sheet",
    lib = true,
}

function Source.onload()
    variable("characterName", "Chris P. Bacon", {type = "string"})
    
    builtinpages.info()
    
    local detailsSection = builtinsections.details()
    
    detailsSection.field("characterName", {
        label = "Character Name",
        type = "string",
        page = "character-info",
        section = "details",
        variable = "characterName",
        default = "Chris P. Bacon",
    })
end

return Source