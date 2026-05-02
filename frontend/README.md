# @B1B2/Client
  ## @types - ``module``
    Folder for global types support across the entire client proyect.
    - Requires dependencies: no
  
  ## @api - ``module``
    Folder for api calls to our server across the entire client proyect.
    - Requires dependencies: @redux/toolkit @redux
    - The common pattern of these modules are just group all api calls per schema, and export it.
    - Use the helpers such as GET, POST, PUT, GET from providers folder.

  ## @assets - ``module``
    @audio - File with url of all audios from our workspace.
    @colors - Custom colors on assets as constants.
    @css - CSS files.
    @devices - Custom media queries and viewport.
    @fonts - @font-faces imported.
    @img - All image sources inside the project.
    @logos - Logos.
    @scss - SCSS files.
    @svg - SVG files.

    Each module conntains a partial responsability in our project.

  ## @components - ``module``
    Each component should be in CamelCase pattern.
    Each component can have a folder, or not.
    If a component needs "subcomponents" create a folder, and make styles inside it to make less complex to see across the project.
    Declare always a typedef for props in the project.
    @typedef {Object} Props
    @property {string} 
    
    Rules for components:
      Can be connected to redux store, can use auth provider:
      Make it easy to use, use relative imports to make things less complex.
      If the component doesn't need @React.memo HOC, don't overuse it, is just for memoization of properties than can lead to a render problems.

  ## @config - ``module``
    This module is very important to set all enviroment variables, and configuration in general, don't put things like constant right here.
    Use constants module instead, only API Keys.

  ## @constant - ``module``
    This module is for setting read only variables and constant than can be used across the project for not making weird things like magic strings or numbers.
    If you feel confident, you can declare constants inside views, or components.
    But if you need it across a couple modules, use this.

  ## @hocs - High Order Components - ``module``
    This module is just for wrapping components with reusable complex logic and conditional rendering.
    One of these components are:
      withModels, withLogout, withVerification, each component is designed to help us to make less complex components.
      @dependencies for use cases - import { compose } from 'redux'
      You can use compose for wrapping multiples hocs inside compose to make more readable.
      compose(memo, withVerification)(MyViewComponent);

  ## @hooks - ``module``
    There's a lot of features for hooks, specially working with redux, you can make a consumer for reducers inside hooks folder.
    For making forms, use UseForm hook, to make steps, and counter use UseCounter hook, to make chats, useChat and pass a token through that.
    You can use localStorage, languages, notifications, media queries support, inline fetch http system and more things.


 ## @lang - ``module``
    Language modules for features, you can use locales, and data to check what is the pattern for making i18next translations inside app.
    Each folder inside data refers to a specific module to make less complex the project.
    Locales are just re-imported modules to export the data safely.


 ## @modules - ``module``
    Like utils we need to make part of the system behaviour, charts, dates, exercises, macthing and something like that.
    There are part that design like a "minimal" library inside our project, feel free to use this pattern or other instead.

 ## @polyfill - ``module``
    Browser Support for ES features, follow the pattern, is just easy to understand.

 ## @providers - ``module``
    These are context providers for our application, EventSource, or WebSockets connection through our entire app that need functionality in points of separation of concerns.
    Like GraphQL Provider, Language Provider, and things like that we dont need to put in redux store.

 ## @route - ``module``
    Router module for our application.
    There are three types of routes, public, private, and testing only.

 ## @state - ``module``
    Isolated pieces of state that we need to put inside this folder.
    Use redux/toolkit to create these modules.

 ## @store - ``module``
    The most important folder in our application, the container for all incoming http request, contains:
    Reducers, Thunks, Controllers, Selectors, Entities, and Actions folder.
    You must know what are redux if you wanna go deep in this project.
    @see https://redux.js.org/

 ## @styled - ``module``
    Just styled components isolation.

 ## @tests - ``module``
    This folder is just for Functional testing, E2E Testing, Unit Testing with Jest.

 ## @views - ``module``
    This folder contains all representational data flow, and HTML rendering content.
    Each view should have an index.js, every route should be rendered with TEMPLATE component.
    Each view can contains, sub components, to make less complex. 