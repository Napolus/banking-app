var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../build')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

var sqlite3 = require('sqlite3')
var crypto = require('bcryptjs')

var db = new sqlite3.Database('./database/bank.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the bank database.');
});

close_db = () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../build/index.html'));
});

app.post("/", (req, res) => {

  const { username, password } = req.body;
  const user_req = 'select username, password, balance from user where username=?';
  // first row only
  db.get(user_req, [username], (err, row) => {
    var data = { username: '', valid: false, balance: 0.0 };
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      if (username === row.username && crypto.compareSync(password, row.password)) {
        data.username = row.username
        data.valid = true;
        data.balance = row.balance;
      }
      else {
        data.valid = false;
      }

    }
    else {
      data.valid = false;
    }
    res.send(data);

  });

  console.log(req.body)

})

app.post("/balance", (req, res) => {

  const { username} = req.body;
  const user_req = 'select username, balance from user where username=?';
  // first row only
  db.get(user_req, [username], (err, row) => {
    var data = { username: '', valid: false, balance: 0.0 };
    if (err) {
      return console.error(err.message);
    }
    if (row) {

        data.username = row.username
        data.valid = true;
        data.balance = row.balance;
      }
      else {
        data.valid = false;
      }
      res.send(data);
    })

    })

app.post("/register", (req, res) => {

  const { username, password } = req.body;
  const user_req = 'select username from user where username=?';

  db.get(user_req, [username], (err, row) => {
    var oui = true;
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      oui = false;
      res.send(oui)

    }
    else {
      const in_req = 'insert into user(username,password) values(?,?)';
      db.run(in_req, [username, crypto.hashSync(password, 8)], (er) => {
        if (er) {
          return console.error(er.message);
        }
      })
      oui = true;
    }
    res.send(oui);

  });
})

app.post("/deposit", (req, res) => {

  var data = { valid: false, mesage: '', balance: 0.0 };
  const { username, amount } = req.body;


  const user_req = 'select username, balance from user where username=?';
  db.get(user_req, [username], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {

      var newBalance = parseFloat(row.balance) + parseFloat(amount);
      //var is_valid=(result<100000000);
      if (newBalance < 100000000) {
        const in_req = 'update user set balance=? where username=?';
        db.run(in_req, [newBalance, row.username], (er) => {
          if (er) {
            return console.error(er.message);
          }
        })
        data.valid = true;
        data.mesage = 'sucessful';
        data.balance = newBalance;
        res.send(data);
      }
      else {
        data.valid = false;
        data.mesage = 'failed';
        data.balance = row.balance;
        res.send(data);
      }
    }
    else {

    }
  })

})


app.post("/withdraw", (req, res) => {

  var data = { valid: false, mesage: '', balance: 0.0 };
  const { username, amount } = req.body;


  const user_req = 'select username, balance from user where username=?';
  db.get(user_req, [username], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {

      var newBalance = parseFloat(row.balance) - parseFloat(amount);
      //var is_valid=(result<100000000);
      if (newBalance >= 0) {
        const in_req = 'update user set balance=? where username=?';
        db.run(in_req, [newBalance, row.username], (er) => {
          if (er) {
            return console.error(er.message);
          }
        })
        data.valid = true;
        data.mesage = 'sucessful';
        data.balance = newBalance;
        res.send(data);
      }
      else {
        data.valid = false;
        data.mesage = 'failed';
        data.balance = row.balance;
        res.send(data);
      }
    }
    else {

    }
  })

})

app.post("/transfer", (req, res) => {

  var data = { valid: false, mesage: '', balance: 0.0 };
  const { username, amount, receiver } = req.body;


  const user_req = 'select username, balance from user where username=?';

  db.get(user_req, [username], (err, row_user) => {
    if (err) {
      return console.error(err.message);
    }
    if (row_user) {

      db.get(user_req, [receiver], (err, row_receiver) => {
        if (err) {
          return console.error(err.message);
        }
        if (row_receiver) {
          var newUserBalance = parseFloat(row_user.balance) - parseFloat(amount);
          var newReceiverBalance = parseFloat(row_receiver.balance) + parseFloat(amount);

          if (newUserBalance < 0 || newReceiverBalance > 100000000) {
            data.valid = false;
            data.mesage = 'imposible operation';
            data.balance = row_user.balance;
            res.send(data);
            return;
          }
          const up_req = 'update user set balance=? where username=?';
          db.run(up_req, [newUserBalance, username], (er) => {
            if (er) {
              return console.error(er.message);
            }
          })
          db.run(up_req, [newReceiverBalance, receiver], (er) => {
            if (er) {
              return console.error(er.message);
            }
          })

          data.valid = true;
          data.mesage = 'sucessful';
          data.balance = newUserBalance;
          res.send(data);

        } else {
          data.valid = false;
          data.mesage = 'unknow receiver';
          data.balance = row.balance;
          res.send(data);
        }
      })
    }
    else {
      data.valid = false;
      data.mesage = 'unknow initiator';
      data.balance = row.balance;
      res.send(data);
    }
  })

})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
