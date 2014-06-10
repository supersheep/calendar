'use strict';

var calendar = require('../lib/index');
var $ = require('jquery');

// To know the usage of `assert`, see: http://nodejs.org/api/assert.html
var assert = require('assert');

describe("description", function() {
  var cal;
  beforeEach(function() {
    cal = new Calendar("#calendar-wrapper");
  });
  it("should has a method `my_method`", function() {
    assert.ok('my_method' in calendar);
  });
});

var cal = new Calendar("#calendar-wrapper").on('change', setHead);
var cal2 = calendar("#calendar-wrapper-custom-day", {
  date: new Date(2014, 5, 1),
  firstDay: 1,
  availiableDays: function(date) {
    return date.getDay() != 2;
  }
});
setHead();

function setHead() {
  year.innerHTML = cal.get('year');
  month.innerHTML = cal.get('humanMonth');
}

function listen(name) {
  cal.on(name, function(e) {
    console.log(name, ":", arguments);
  });
  cal2.on(name, function(e) {
    console.log(name, ":", arguments);
  });
}
listen("pick");
listen("hover");
listen("mouseleave");
prevMonth.onclick = function() {
  cal.prevMonth();
}
nextMonth.onclick = function() {
  cal.nextMonth();
}
prevYear.onclick = function() {
  cal.prevYear();
}
nextYear.onclick = function() {
  cal.nextYear();
}
var toggled = false;
changeAvail.onclick = function() {
  toggled = !toggled;
  if (toggled) {
    cal2.setAvailableDates(function(date) {
      return date.getDay() != 4;
    });
  } else {
    cal2.setAvailableDates(function(date) {
      return date.getDay() != 2;
    });
  }
}