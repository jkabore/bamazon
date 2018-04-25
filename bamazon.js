var mysql = require("mysql");
var inquirer = require("inquirer");
var userInput = process.argv[2];
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "ABc70260541",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    runSearch();
});

function productsList() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);



    });
}

function runSearch() {
    inquirer
        .prompt({
            name: "confirm",
            type: "confirm",
            message: "Welcome to bamazon."+"\n"+"This is our inventory",
            default: true
        }).then(function (data) {
            if (data.confirm === true) {
                productsList();
                slectItem();
            } else {
                console.log("come back soon!");
                connection.connect(function (err) {
                    if (err) throw err;
                    console.log("connected as id " + connection.threadId + "\n");
                    runSearch();
                });

            }

        });
}

function slectItem() {
    inquirer
        .prompt({
            name: "input",
            type: "productId",
            message: "Enter the product id you would like to buy"
        },
    {
       name:"input" ,
       type:"quantity",
       message:"please enter how many items you would like to buy"


    }).then(function (user) {
        connection.query("SELECT * FROM products WHERE id=?", user.productId,function (err, res) {
            if (err) throw err;
           for(var i=0;i<res.length;i++){
               if(user.quantity>0 && user.quantity>res[i].stock_quantity){
                   console.log("SORRY we only have"+ res[i].stock_quantity + "items left");
               }else{
                   console.log("This is your order ");
                   console.log("Item: " + res[i].product_name);
                   console.log("Department: " + res[i].department_name);
                   console.log("Price: " + res[i].price);
                   console.log("Quantity: " + user.quantity);
                   console.log("----------------");
                   console.log("Total: " + res[i].price * user.quantity);
               }
           }
    
    
    
        });
        
    });
}



