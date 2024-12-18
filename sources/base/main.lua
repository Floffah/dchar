local Source = {
    name = "Base Source",
    author = "DChar Contributors",
    description = "Implements all the base functionality for a DChar character sheet",
}

function Source.onload()
    variable("characterName", "Chris P. Bacon", {type = "string"})
    
    editwizard.page("character-info", "Character Info")
    
    editwizard.section("details", "Details", "character-info")
    
    editwizard.field("characterName", {
        label = "Character Name",
        type = "string",
        page = "character-info",
        section = "details",
        variable = "characterName",
        default = "Chris P. Bacon",
    })
end

return Source