# Error-Handling

Error handling essentially consists of three components:

| file                                                             | description                                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`src/components/error/`](src/components/error)                  | The files for the graphical representation of the error messages are located here. |
| [`src/services/ErrorHandler.tsx`](src/services/ErrorHandler.tsx) | Contains the list of error messages and functions to edit them                     |
| [`src/services/Errors.tsx`](src/services/Errors.tsx)             | Contains a dictionary with all error codes and the associated error descriptions   |

## Errors.tsx

We use this file to provide an overview of the existing error messages and associate a uniform description to the error messages. The goal was to treat the same errors in the same way. As well as having a unified error handling, we wanted to establish a design pattern in which there is central handling of errors. Handling the errors in a central place was the cleaner choice because the properties of an error message relate to the error description and the way the error is displayed (size, icon, removable).

## MessageKey

In order to create this central handling, we declared a message key that uniquely identifies an error and can be used by typescript dictionaries, switch-case statements and functions.

All MessageKeys follow the same naming convention. We give increasingly specific descriptions of the error after a period.
Using this pattern enables actions (e.g. deletion or display control) to be carried out on a group of errors by addressing them with the keyword internet, for example.

For a list of MessageKeys and their descriptions used in the App, refer to [`services/Errors.tsx`](../services/Errors.tsx) where the MessageKeys are defined.

### `errorhandler.tsx`

The core of this file is the errorList variable. This variable contains a list of message keys, i.e. all error messages that currently exist. Error messages can be added to or removed from the list using the handleError() and remError() methods.

### handleError()

This function only requires the MessageKey as a parameter. It checks whether the passed error message is already in the list and adds it if need be.

### remError()

Like handleError(), this function only needs the MessageKey to delete the error message and delete all subordinate error messages with the optional parameter includeSubtypes (errType='internet', includeSubtypes=true would delete all internet error messages).
