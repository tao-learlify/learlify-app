# RULES to create actions, and reducers

### 1. Reducers state should be only necessary to shared data across components and nested components.

```
 Example:
 
  const initialState = {
    loadingProfile: false,
  } 

  const loadingReducer = (state, action) => {
    ...events
  }
```

#####
  In this example we are adding a useful reducer to handling all loading actions.
  For example if in the process or loading profile, you can navigate to other window.
  We can dispatch or emit a modal to indicate that wants to leave.
#####

### 2. Don't use reducers to handling or event bindings.

```
  Can't be necessary to abstract the event logic, internal state should be okay in this project enough.
```

### 3. Actions files should be asynchronous. (Optional)

```
  We only handle asynchronous data in our actions file.
  If you want to make simple dispatch you can use mapDisaptchToProps.
```

### 4. Add a meaningful name to event types.

```
  This is very important and event types should be self document.
  You should be along with the types.js file, and add a @memberof and @description
```