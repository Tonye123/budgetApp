//BUDGET CONTROLLER
let budgetController = (function() {
  'use strict';


}());

//UI CONTROLLER
let UIController = (function() {
  'use strict';
  let DOMstrings  = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn'
  };
  return {
      getValue: function() {
        return {
         type:document.querySelector(DOMstrings.inputType).value, //will be either unc or exp
         description:document.querySelector(DOMstrings.inputDescription).value,
         value:document.querySelector(DOMstrings.inputValue).value
          }//this returns an object with the need values
      },
      getDomStrings: function() {
        return DOMstrings;
      }

  }
}());

//this controller connects the UI and budgetController module
//it takes input from the UI and sends it to thr budgetController
//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl,UIctrl) {
  'use strict';
    let setUpEventListeners = function() {
      let DOM = UIctrl.getDomStrings();
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
     //when key is pressed it's not on a specific element
     //it is on the document itself
      document.addEventListener('keypress',function(e) {
          if (e.keycode === 13 || e.which === 13) {
                ctrlAddItem();
              }


            });

        };


  let ctrlAddItem = function() {
    //get the filled input data
    let input = UIctrl.getValue();

    //add the item to the budget CONTROLLER
    //add the item to the UI
    //Calculate the budget
    //Display the budget on the UI

  };

    return {
        init: function() {
          console.log("Application has started");
          setUpEventListeners();
        }
    }



}(budgetController,UIController));

controller.init();
