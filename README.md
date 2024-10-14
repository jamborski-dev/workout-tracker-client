Flow:

Click 'Start Training' or 'Start Training (from a template)'

1. Option 'Start Training'

- backend pinged to create new empty routine record and return ID
- UI changes to empty routine with current date, route: /routine/:id
- User chooses first exercise from SelectList and its being added to the routine as a Movement,
- User selects variable or fixed sets option (use fixed as default),
- User sets planned sets, reps and weight as he goes - each is being save in to the backend as it goes

- repeat for all rest exercises
