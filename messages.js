exports.CREATE_MENU_MESSAGES = Object.freeze({
    newMenuIntroduction:'To add a new menu, please first enter the name of the restaurant you would' +
        'like to add. Or use the /cancel command to cancel the creation.',
    newCategoryIntroduction:'Now let\'s add a new category for your Menu. Please enter the name of your ' +
        'category or cancel the process with /cancel.',
    newItemIntroduction: categoryName => `Category ${categoryName} has successfully been created! Now let's add some items! Please input the name of the item.`,
    newPriceIntroduction: foodName => `${foodName} has been added successfully! Let's add its price!`,
    nextItem: 'Item has successfully been created! Input /done to complete this category or input the name of the next item',
    nextCategory: 'Category successfully created! You can add a new one by inputting its name or complete the menu with /done'
})
