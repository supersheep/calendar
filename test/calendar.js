'use strict';

var assert = require('assert');
var calendar = require('../lib/index');
var $ = require('jquery');

// To know the usage of `assert`, see: http://nodejs.org/api/assert.html
var assert = require('assert');

describe("description", function() {
  var cal;
  var container;
  beforeEach(function() {
    cal = calendar("#calendar-wrapper", {
      renderDay: function(td) {
        td.addClass('custom-class');
      },
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    });
    container = cal.get('container');
  });

  it('options.defaultDate', function() {
    var defaultDate = cal.get('defaultDate');
    console.log(defaultDate);
    defaultDate.toDateString() == (new Date()).toDateString();
  });

  it('options.weekdays', function() {
    assert(container.find('th').html() == 'Sunday', true);
  });

  it('options.renderDay', function() {
    container.find('td').each(function(i, td) {
      assert($(td).hasClass('custom-class'));
    });
  });

  it('.setYear', function() {
    cal.setYear(2019);
    assert(cal.get('year'), 2019);
  });
  it('.setMonth', function() {
    cal.setMonth(9);
    assert(cal.get('month'), 9);
    cal.setMonth(13);
    assert(cal.get('month'), 1);
    assert(cal.get('humanMonth'), 2);
  });


  it('.prevYear', function() {
    cal.prevYear();
    assert(cal.get('year'), 2018);
  });
  it('.nextYear', function() {
    cal.nextYear();
    assert(cal.get('year'), 2019);
  });
  it('.prevMonth', function() {
    cal.prevMonth();
    assert(cal.get('month'), 0);
  });
  it('.nextMonth', function() {
    cal.prevMonth();
    assert(cal.get('month'), 1);
  });

  it('.setAvailableDates', function() {
    cal.setAvailableDates(function(date) {
      return date.getDay() != 4;
    });
    container.find('tr').find('td:eq(4)').each(function(i, el) {
      assert($(el).hasClass('ui-calendar-invalid'), true);
    });
  });
});