--- ## DChar Global Builtins
---
--- Defines builtin functions that are implemented in lua rather than in the engine.
---
---@copyright 2024
---@license MIT
---@author Floffah

--- Get the value of a variable.
---@param name string
---@return any
function getvariable(name)
    return variable(name).get()
end

--- Set the value of a variable.
---@param name string
---@param value any
function setvariable(name, value)
    variable(name).set(value)
end

builtinpages = {
    info = function() 
        editwizard.page("character-info", "Character Info")
    end
}

buildinsections = {
    details = function()
        editwizard.section("details", "Details", "character-info")
    end
}