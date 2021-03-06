//_______________________________________________________BEGIN setup

var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var expressHbs = require('express-handlebars');

app.engine('hbs', expressHbs({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb+srv://emora:12345ABc@cluster0.mfzgj.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

var Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true
    }
})

//_______________________________________________________END setup



//_______________________________________________________BEGIN Read ( render ) todos to home page 
app.get('/', function(req, res) {
	try{Todo.find(function(err, arrayOfItems) {
        res.render('index', {
            todos: arrayOfItems
        });
    });}catch (error) {
  console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}
	
	
	
	
	
	res.render('index')
    
});


app.get('/id', function(req, res) {

    res.send("hola")
});

//_______________________________________________________END Read ( render ) todos to home page


//_______________________________________________________BEGIN Create todo and update page
app.post('/', function(req, res) {

    var todo = new Todo({
        task: req.body.task
    }).save(function(err) {
        //______________________________|BEGIN
        Todo.find(function(err, toHBS) {

            todos: toHBS

        });
        //______________________________|END

        res.redirect('/');

    });

});

//________________________________________________________END Create todo and update page




//________________________________________________________BEGIN Update todo




app.get('/edit/:id/', function(req, res) {

    var id = req.params.id;

    Todo.findOne({
        _id: id
    }, function(err, doc) {

        res.render('edit', {
            todos: doc
        });

    });


})



app.post('/update/:id', function(req, res) {

    var id = req.params.id;

    Todo.findById(id, function(err, todo) {


        todo.task = req.body.updated_task
        todo.save();

        return res.redirect('/');

    });


})



//_______________________________________________________END Update todo









//_______________________________________________________BEGIN Delete todo and update the page


app.get('/delete/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!err) {

            todo.remove();


        } else {
            return err
        }
    });
    return res.redirect('/');
})


//_______________________________________________________END Delete todo and update the page









//_______________________________________________________BEGIN start server

app.listen(3000, function(err) {
    if (err) {
        console.log('server no levant??');
    } else {
        console.log('El servdidor est?? en funcionamiento . . .  ')
    }
})
//_______________________________________________________END start server