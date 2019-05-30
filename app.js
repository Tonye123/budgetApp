//BUDGET CONTROLLER
let budgetController = (function() {
  //'use strict';
  //function constructor- cause there'll be lots of expenses
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc:[]
    },
    totals: {
      exp: 0,
      inc: 0
    }

  }

//public method to add items to the data structure
return {
  addItem: function(type,des,val) {
    let newItem, ID;
    ID = 0;
    //[1 2 3 4 5], next ID = 6
    //[1 2 4 6 8], next ID= 9
    //ID = last ID + 1

    //create new ID
    if (data.allItems[type].length > 0) {
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
    } else {
      ID = 0;
    }


    //create new item based on 'inc' or 'exp'
    if(type === 'exp'){
    newItem = new Expense(ID,des,val)
    } else if(type === 'inc') {
    newItem = new Income(ID,des,val);
        }
        //push it into our data structure
        data.allItems[type].push(newItem);

        //return the new element
        return newItem;
    },

    testing: function() {
      console.log(data);
    }





}

}());

//UI CONTROLLER
let UIController = (function() {
  'use strict';
  let DOMstrings  = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer:'.expenses__list'
  };
  return {
       getValue: function() {
           return {
             type:document.querySelector(DOMstrings.inputType).value, //will be either unc or exp
             description:document.querySelector(DOMstrings.inputDescription).value,
             value:document.querySelector(DOMstrings.inputValue).value
           }//this returns an object with the needed values
         },

      addListItem: function(obj,type) {
          let html, newHtml, element;
          //create HTML string with placeholder text
          if (type === 'inc') {
            element = DOMstrings.incomeContainer;
          html ='<div class="item clearfix" id="income-%id%"><div class=\"item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

           }else if (type==='exp') {
           element = DOMstrings.expenseContainer;
           html = '<div class="item clearfix" id="expense-%id%"><div class=\"item__description">%description%</div> <div class=\"right clearfix\"><div class="item__value">%value%</div><div class="item__percentage">21%</div <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }



          //Replace the placeholder text with some actual data
            newHtml =  html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
          //insert the html into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeBegin',newHtml);

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
    let newItem = budgetCtrl.addItem(input.type,input.description,input.value);
    //add the item to the UI
    UIctrl.addListItem(newItem, input.type);
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
