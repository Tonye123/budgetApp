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

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) {
          sum = sum + cur.value;
        });
        data.totals[type] = sum;

    }

    let data = {
      allItems: {
          exp: [],
          inc:[]
      },
      totals: {
          exp: 0,
          inc: 0
      },
      budget: 0,
      percentage: -1


    };

//public method to add items to the data structure and remove
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

      deleteItem: function(type,id) {
              //create an array of all the Ids we have, to get the index
              //of the id we need to delete
              //ids = [1 5 7 8]
              let ids = data.allItems[type].map(function(current) {

                  return current.id ;

              });
              let index = ids.indexOf(id);
              if (index !== -1) {
                  data.allItems[type].splice(index, 1);

              }
        },

      calculateBudget: function() {
              //calculate total income and expenses
              calculateTotal('exp');
              calculateTotal('inc');

              //calculate the budget: income - expenses
              data.budget = data.totals.inc - data.totals.exp;


              //calculate the percentage of income that we spent
              if(data.totals.inc > 0) {
                  data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

                }else {
                    data.percentage = -1;
                  }
           },

      getBudget: function() {
              return {
                budget: data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage: data.percentage

          };
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
      expenseContainer:'.expenses__list',
      budgetLabel:'.budget__value',
      incomeLabel:'.budget__income--value',
      expenseLabel:'.budget__expenses--value',
      percentageLabel:'.budget__expenses--percentage',
      container: '.container'
  };
  return {
       getValue: function() {
           return {

             type:document.querySelector(DOMstrings.inputType).value, //will be either unc or exp
             description:document.querySelector(DOMstrings.inputDescription).value,
             value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
                 }//this returns an object with the needed values
            },

      addListItem: function(obj,type) {
          let html, newHtml, element;
          //create HTML string with placeholder text
          if (type === 'inc') {
            element = DOMstrings.incomeContainer;
          html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

           }else if (type==='exp') {
           element = DOMstrings.expenseContainer;
         html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }



          //Replace the placeholder text with some actual data
            newHtml =  html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeBegin',newHtml);

        },

      deleteListItem: function(selectorID){
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },
      clearFields: function() {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            let fieldsArr = Array.prototype.slice.call(fields); //coverts fields list to an Array
            fieldsArr.forEach(function(current, index, array) {
                  current.value = "";

            });
            fieldsArr[0].focus();
          },
       displayBudget: function(obj) {//obj that contains the needed data

            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            }else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }

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
              document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
                };

        let updateBudget = function() {
             //Calculate the budget
                budgetCtrl.calculateBudget();
               //Return the budgetCtrl
                let budget = budgetCtrl.getBudget();
                //Display the budget on the UI
                UIctrl.displayBudget(budget);
            }


        let ctrlAddItem = function() {
               //get the filled input data
              let input = UIctrl.getValue();

              if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

                      //add the item to the budget CONTROLLER
                      let newItem = budgetCtrl.addItem(input.type,input.description,input.value);
                      //add the item to the UI
                      UIctrl.addListItem(newItem, input.type);
                      //clear fields
                      UIctrl.clearFields();

                      //Calculate and update
                      updateBudget();

            }

      };


        let ctrlDeleteItem = function (event) {
            //event is put here so we know where the event came from i.e the target event
            let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (itemID) {
                let splitID = itemID.split('-'); //split is used to break up a string into parts and placed in an array
                let type = splitID[0];
                let id = parseInt(splitID[1]);
                //delete item from the data structure
                budgetCtrl.deleteItem(type, id);

                //Delete the item from the UI
                UIctrl.deleteListItem(itemID);

                //update and show the new budget
                updateBudget();

            } else{alert("yup");}
        };

        return {
            init: function() {
              console.log("Application has started");
              UIctrl.displayBudget({
              budget: 0,
              totalInc:0,
              totalExp:0,
              percentage: -1});
              setUpEventListeners();
            }
        }



}(budgetController,UIController));

controller.init();
