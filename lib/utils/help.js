'use strict';

var IonicAppLib = require('ionic-app-lib');
var log = IonicAppLib.logging.logger;
require('colors');

/**
 * @method printIonic
 * @return {Array} Returns array of lines to print for ionic name
 */
function printIonic(ionicVersion) {
  return [
    '  _             _          ',
    ' (_)           (_)         ',
    '  _  ___  _ __  _  ___     ',
    ' | |/ _ \\| \'_ \\| |/ __| ',
    ' | | (_) | | | | | (__     ',
    ' |_|\\___/|_| |_|_|\\___|  CLI v' + ionicVersion
  ];
}


/**
 * @method printTemplate
 * @param {Array} lineArray list of lines to print
 * @return {Null} no return value
 */
function printTemplate(lineArray) {
  log.info(lineArray.reduce(function(all, line) {
    all += (line !== null) ? line + '\n' : '';
    return all;
  }, ''));
}


/**
 * @method printAvailableTasks
 * @param {String} taskName task name supplied to cli
 * @return {Null} no return value
 */
function printTaskListShortUsage(taskList, taskName, ionicVersion) {
  var taskLines = taskList
    .filter(function(task) {
      return task.summary;
    })
    .map(function(task) {
      var name = '   ' + task.name + '  ';
      var dots = '';
      while ((name + dots).length < 20) {
        dots += '.';
      }
      return name.green.bold + dots.grey + '  ' + task.summary.bold;
    });

  var lines = [].concat(
    printIonic(ionicVersion),
    [
      '',
      'Usage: ionic task args',
      '',
      '',
      '=======================',
      (taskName ?
        (taskName + ' is not a valid task\n\n').bold.red
        : null),
      'Available tasks: '.bold,
      '(use --help or -h for more info)',
      '',
      ''
    ],
    taskLines
  );

  printTemplate(lines);
}


/**
 * @method printTaskUsage
 * @return {Null} no return value
 */
function printTaskUsage(task, ionicVersion) {
  var lines = [].concat(
    printIonic(ionicVersion),
    [
      '',
      '=======================',
      ''
    ]
  );
  printTemplate(lines);

  printTaskDetails(task);

  printTemplate([
    ''
  ]);
}


/**
 * @method printAllTaskUsage
 * @return {Null} no return value
 */
function printTaskListUsage(taskList, ionicVersion) {
  var lines = [].concat(
    printIonic(ionicVersion),
    [
      '',
      '=======================',
      ''
    ]
  );
  printTemplate(lines);

  taskList
    .filter(function(task) {
      return task.summary;
    }).forEach(function(task) {
      return printTaskDetails(task);
    });

  printTemplate([
    ''
  ]);
}


/**
 * @method printTaskDetails
 * @return {Null} no return value
 */
function printTaskDetails(d) {
  function w(s) {
    process.stdout.write(s);
  }

  w('\n');

  var rightColumn = 45;
  var dots = '';
  var indent = '';
  var x;
  var arg;

  var taskArgs = d.title;

  for (arg in d.args) {
    if ({}.hasOwnProperty.call(d.args, arg)) {
      taskArgs += ' ' + arg;
    }
  }

  w(taskArgs.green.bold);

  while ((taskArgs + dots).length < rightColumn + 1) {
    dots += '.';
  }

  w(' ' + dots.grey + '  ');

  if (d.summary) {
    w(d.summary.bold);
  }

  for (arg in d.args) {
    if (!d.args[arg]) continue;

    indent = '';
    w('\n');
    while (indent.length < rightColumn) {
      indent += ' ';
    }
    w((indent + '    ' + arg + ' ').bold);

    var argDescs = d.args[arg].split('\n');
    var argIndent = indent + '    ';

    for (x = 0; x < arg.length + 1; x += 1) {
      argIndent += ' ';
    }

    for (x = 0; x < argDescs.length; x += 1) {
      if (x === 0) {
        w(argDescs[x].bold);
      } else {
        w('\n' + argIndent + argDescs[x].bold);
      }
    }
  }

  indent = '';
  while (indent.length < d.name.length + 1) {
    indent += ' ';
  }

  var optIndent = indent;
  while (optIndent.length < rightColumn + 4) {
    optIndent += ' ';
  }

  for (var opt in d.options) {
    if ({}.hasOwnProperty.call(d.options, opt)) {
      w('\n');
      dots = '';

      var optLine = indent + '[' + opt + ']  ';

      w(optLine.yellow.bold);

      if (d.options[opt]) {
        while ((dots.length + optLine.length - 2) < rightColumn) {
          dots += '.';
        }
        w(dots.grey + '  ');

        var taskOpt = d.options[opt];
        var optDescs;

        if (typeof taskOpt == 'string') {
          optDescs = taskOpt.split('\n');
        } else {
          optDescs = taskOpt.title.split('\n');
        }
        for (x = 0; x < optDescs.length; x += 1) {
          if (x === 0) {
            w(optDescs[x].bold);
          } else {
            w('\n' + optIndent + optDescs[x].bold);
          }
        }
      }
    }

    w('\n');
  }
}

module.exports = {
  printTaskListShortUsage: printTaskListShortUsage,
  printTaskListUsage: printTaskListUsage,
  printTaskUsage: printTaskUsage
};
