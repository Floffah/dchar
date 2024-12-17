local Source = {
    name = "Base Source",
    author = "DChar Contributors",
    description = "Implements all the base functionality for a DChar character sheet",
}

function Source.onload()
    declarevariable("Character Name", "Chris P. Bacon", {type = "string"})
end

return Source