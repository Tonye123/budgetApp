//BUDGET CONTROLLER
let budgetController = (function() {
    //'use strict';
    //function constructor- cause there'll be lots of expenses
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
      };

      Expense.prototype = {
              constructor: Expense,
              calcPercentage: function(totalIncome) {
                if (totalIncome > 0) {
                    this.percentage = Math.round((this.value / totalIncome) * 100);
                }else {
                  this.percentage = -1;
                }

              },

              getPercentage: function() {
                return this.percentage;
            }

      }

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

      calculatePercentages: function() {
        /*
        a = 20
        b = 10
        c = 40
        a = 20/100 = 20%
        b= 10/100 = 10%
        c = 40/100 = 40%
        */

        data.allItems.exp.forEach(function(cur) {
            cur.calcPercentage(data.totals.inc);
        })

      },

      getPercentages: function() {
          let allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
          });

          return allPerc;
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
      container: '.container',
      expensesPercLabel:'.item__percentage',
      dateLabel:'.budget__title--month'
  };
  let formatNumber =  function(num,type) {
          let int,dec,numSplit,sign;
             num = Math.abs(num);
             num = num.toFixed(2);

             numSplit = num.split('.');

             int = numSplit[0];
             if(int.length > 3) {
                 int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);

                 }

                 dec = numSplit[1];

             return (type === 'exp' ? sign = '-' : sign = '+') + ''+ int + '.' + dec;
  };

  let nodeLIstForEach = function(list,callback) {
    for(let i = 0; i < list.length; i++) {
         callback(list[i], i);
     }

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
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type ));
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
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');

            if(obj.percentage > 0) {
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            }else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }

         },

       displayPercentages: function(percentages) {
         let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



         nodeLIstForEach(fields, function(current,index) {
           if(percentages[index] > 0) {
              current.textContent = percentages[index] + '%';

           } else {
             current.textContent = '---';
           }


         });



       },

       displayMonth: function() {
          /*let now = new Date();
          let year = now.getFullYear();
          let month = now.getMonth();

          document.querySelector(DOMstrings.dateLabel).textContent = month + '' + year;
          */
          let date = new Intl.DateTimeFormat("en",{year:"numeric",month:"long"}).format();
          document.querySelector(DOMstrings.dateLabel).textContent = date;
       },

       changedType: function() {
            let fields = document.querySelectorAll(
              DOMstrings.inputType + ',' +
              DOMstrings.inputDescription + ',' +
              DOMstrings.inputValue
            );

            nodeLIstForEach(fields, function(cur){
              //toggle removes class if present and adds if absent
                cur.classList.toggle('red-focus');

            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

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
              document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);
                };

        let updateBudget = function() {
             //Calculate the budget
                budgetCtrl.calculateBudget();
               //Return the budgetCtrl
                let budget = budgetCtrl.getBudget();
                //Display the budget on the UI
                UIctrl.displayBudget(budget);
            }

        let updatePercentages = function() {
              //Calculate percentages
              budgetCtrl.calculatePercentages();

              //readd percentages from the budget CONTROLLER
              let percentages = budgetCtrl.getPercentages();

              //Update the UI with the new percentages
              UIctrl.displayPercentages(percentages);


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

                      //calculate and update percentages
                      updatePercentages();

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

                //calculate and update update percentage
                updatePercentages();

            }
        };

        return {
            init: function() {
              console.log("Application has started");
              UIctrl.displayMonth();
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
