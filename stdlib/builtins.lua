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

--- Built in edit wizard pages
builtinpages = {}

--- The default character info page
function builtinpages.info()
    editwizard.page("character-info", "Character Info")
end

--- Built in edit wizard sections
builtinsections = {}

--- The default character details section
function builtinsections.details()
    editwizard.section("details", "Details", "character-info")
end