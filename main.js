const contactApp = () => {

    //DOM
    const form = document.querySelector('.form')
    const newNameInput = document.querySelector('.input__new-name')
    const newTelInput = document.querySelector('.input__new-tel')
    const addBtn = document.querySelector('.btn__add')
    const deleteAllBtn = document.querySelector('.btn__delete-all')
    const contactContainer = document.querySelector('.contacts__container')
    const contactList = document.querySelector('.contacts__list')
    const defaultMessage = document.querySelector('.default-message')

    // Create an error message for form
    let errorMessage = document.createElement('p')

    // Create array for contacts
    let contacts = []
    
    // function to add a new item
    const addItem = (e) => {
        
        e.preventDefault()

        // When one or both fields are NOT filled
        if ( !newNameInput.value || !newTelInput.value ) {

            errorMessage.className = "form__message"
            errorMessage.innerText = "Please fill both fields to create a new contact."
            form.append(errorMessage)

        // When both fields are filled
        } else {

            errorMessage.remove()

            // Create contact item object
            const contactObject = {
                id: Date.now(),
                name: newNameInput.value,
                tel: newTelInput.value
            }

            // Push object to array
            contacts.push(contactObject)

            // Save to local storage
            saveContactsInLocalStorage(contacts)
            
            // Empty inputs
            newNameInput.value = ""
            newTelInput.value = ""
            
        }

    }
    addBtn.addEventListener('click', addItem)
    
    // Function to edit item
    const editItem = (e) => {

        const editBtn = e.target
        const editingItem = editBtn.closest('li')
        const editingInputs = editingItem.querySelectorAll('input')

        // Remove disabled from input
        editingInputs[0].removeAttribute("disabled", "")
        editingInputs[1].removeAttribute("disabled", "")

        // Remove edit button & add save button
        editBtn.remove()
        const saveBtn = document.createElement('button')
        saveBtn.innerText = "Save"
        saveBtn.className = "btn__save"
        editingInputs[1].after(saveBtn)

        saveBtn.addEventListener('click', saveItem)

    }

    // Function to save item
    const saveItem = (e) => {

        const saveBtn = e.target
        const savingItem = saveBtn.closest('li')
        const savingInputs = savingItem.querySelectorAll('input')
        
        // When NOT both fields are filled
        if ( !savingInputs[0].value || !savingInputs[1].value ) {

            // Show error message
            errorMessage.className = "list__message"
            errorMessage.innerText = "Please fill both fields to save changes."
            savingItem.append(errorMessage)
            
        // When both fields are filled
        } else {

            errorMessage.remove()
            
            // Get object where object is the same as the parent of the clicked button
            const itemId = parseInt(savingItem.dataset.id)
            let itemToBeSaved = contacts.find(contact => contact.id === itemId)

            // Save changes in object
            itemToBeSaved.name = savingInputs[0].value
            itemToBeSaved.tel = savingInputs[1].value

            // Remove save button & add change button
            saveBtn.remove()
            const editBtn = document.createElement('button')
            editBtn.innerText = "edit"
            editBtn.className = "btn__edit"
            savingInputs[1].after(editBtn)

            // Set disabled to input
            savingInputs[0].setAttribute("disabled", "")
            savingInputs[1].setAttribute("disabled", "")

            // Save updated contacts array
            saveContactsInLocalStorage(contacts)

        }

    }

    // Function to delete item
    const deleteItem = (e) => {

        // Get object where object is the same as the parent of the clicked button
        const deletingItem = e.target.closest('li')
        const itemId = parseInt(deletingItem.dataset.id)

        if( !itemId ) return

        const newContacts = contacts.filter(contact => contact.id !== itemId)

        contacts = newContacts
        
        saveContactsInLocalStorage(newContacts)

        // Show default message when the last item is deleted
        if ( contacts.length == 0 ) {
            
            contactContainer.append(defaultMessage)
            deleteAllBtn.setAttribute("disabled", "")
            
        }
    }

    // Function to delete whole list
    const deleteAllItems = (e) => {

        if( !contacts ) return

        let deleteAll = confirm('Are you sure to delete a whole list?')
    
        if ( deleteAll === true ) {

            contacts.length = 0
            saveContactsInLocalStorage(contacts)
        
            contactContainer.append(defaultMessage)
            deleteAllBtn.setAttribute("disabled", "")
        
        }
    }
    deleteAllBtn.addEventListener('click', deleteAllItems)

    // Function to render contact list
    const renderContactsList = (contacts) => {

        if( !contacts ) return

        defaultMessage.remove()
        deleteAllBtn.removeAttribute("disabled", "")
        contactList.innerHTML = ""

        contacts.forEach(contact => {

            // Create a list item
            const newItem = document.createElement('li')
            newItem.className = "contact__item"
            newItem.dataset.id = contact.id

            const div = document.createElement('div')
            div.className = "item__inner"

            // Add name to list item
            const addedNameInput = document.createElement('input')
            addedNameInput.type = "text"
            addedNameInput.className = "input__added-name"
            addedNameInput.setAttribute("disabled", "")
            addedNameInput.value = contact.name
            div.append(addedNameInput)
            
            // Add tel to list item
            const addedTelInput = document.createElement('input')
            addedTelInput.type = "text"
            addedTelInput.className = "input__added-tel"
            addedTelInput.setAttribute("disabled", "")
            addedTelInput.value = contact.tel
            div.append(addedTelInput)

            // Add edit button to list item
            const editBtn = document.createElement('button')
            editBtn.innerText = "Edit"
            editBtn.className = "btn__edit"
            div.append(editBtn)

            // Add delete button to list item
            const deleteBtn = document.createElement('button')
            deleteBtn.innerText = "Delete"
            deleteBtn.className = "btn__delete"
            div.append(deleteBtn)

            // Add list item to list
            newItem.append(div)
            contactList.append(newItem)

            // Event listeners
            editBtn.addEventListener('click', editItem)
            deleteBtn.addEventListener('click', deleteItem)

        })

    }

    // Function to save contacts in local storage
    const saveContactsInLocalStorage = (contacts) => {

        if ( !contacts ) return
        
        // Store array in LocalStorage
        localStorage.setItem('contacts', JSON.stringify(contacts))

        // Render saved contact list
        renderContactsList(contacts)

    }
    
    // Function to get contacts from localStorage
    const getContactsFromLocalStrage = () => {

        // Get stored todos from LocalStrage
        const storedContacts = localStorage.getItem('contacts')

        if( !storedContacts ) return

        // Set array to stored array
        contacts = JSON.parse(storedContacts)

        // Render contacts list
        renderContactsList(contacts)

    }
    getContactsFromLocalStrage()

}
contactApp()