
class AppDispatcher {

  constructor(){
    this._registeredCallbacks = [];
  }

  /**
  * Register callbacks with the Dispatcher.
  */
  register(callback){
    // save the callback internally
    this._registeredCallbacks.push(callback);
  }

  /**
  * Dispatch an action -> call the registered callbacks with the provided data.
  */
  dispatch(actionData){
    // call all registered callbacks with the provided data
    this._registeredCallbacks.forEach(currCallback => {currCallback(actionData)});
  }

}

export default new AppDispatcher;
